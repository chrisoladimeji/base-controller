import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventsGateway } from '../events/events.gateway';
import { SisService } from '../sis/sis.service';
import { AcaPyService } from '../services/acapy.service';
import { parse, getWorkflows,getWorkflowById, getWorkflowInstance, updateWorkflowInstanceByID } from '@veridid/workflow-parser';

import { WorkflowService } from '../workflow/workflow.service';

@Injectable()
export class ConnectionService {
  constructor(
    private readonly configService: ConfigService,
    private readonly eventsGateway: EventsGateway,
    private readonly sisService: SisService,
    private readonly acapyService: AcaPyService,
    private readonly workflowService: WorkflowService
  ) {}

  async handleConnection(connectionData: any): Promise<void> {
    if (connectionData.state === 'request') {
      console.log('Current status is request.');
      this.emitEvent(connectionData, null, null);
    } else if (connectionData.state === 'active') {
      console.log('Connection is active.', connectionData);
      await this.workflowService.initiateDefaultWorkflow(connectionData.connection_id);
    }
  }

  private async handleActiveState(connectionData: any) {
    const alias = connectionData.alias;
    if (!alias) {
      console.error('Alias is undefined');
      await this.acapyService.sendWelcomeMessage(connectionData);
      return;
    }

    const studentNumber = this.extractStudentNumber(alias);
    console.log('Extracted studentNumber:', studentNumber);

    let attributes: any;

    try {
      const studentIdCred = await this.sisService.getStudentId(studentNumber);
      console.log('studentIdCred at ConnectionController', studentIdCred);

      if (studentIdCred) {
        attributes = this.createAttributes(studentIdCred);
        const credentialOfferBody = {
          "auto_issue": true,
          "auto_remove": false,
          "connection_id": connectionData.connection_id,
          "cred_def_id": this.configService.get<string>('STUDENTID_CREDENTIAL_DEFINITION_ID'),
          "credential_preview": {
            "@type": "issue-credential/1.0/credential-preview",
            "attributes": attributes
          }
        }
      } else {
        console.error(
          'Unable to obtain Student info from Student Information System',
        );
        // attributes = this.createFallbackAttributes(alias);
        this.acapyService.sendWelcomeMessage(connectionData);
      }
    } catch (error) {
      console.error('Error retrieving studentIdCred:', error);
      // attributes = this.createFallbackAttributes(alias);
      this.acapyService.sendWelcomeMessage(connectionData);
    }

    this.emitEvent(
      connectionData,
      attributes,
      this.configService.get<string>('STUDENTID_CREDENTIAL_DEFINITION_ID'),
    );
    //await setWorkflowInstance(connectionData.connection_id, 'root-menu', 'ConnectionActive', { "threadId": connectionData?.thread_id })
    
    await this.acapyService.sendWelcomeMessage(connectionData);
    const WORKFLOW_ID = 'root-menu';
        const CURRENT_STATE = 'ConnectionActive'
        const connectionId = connectionData.connection_id;
        console.log("Verfication data from request-sent state", connectionData);
        //Add threadId into workflow instance ID 
        const threadId = connectionData?.thread_id;
        const response = await this.workflowService.getInstanceByID(`${connectionId}`, `${WORKFLOW_ID}`)
        console.log("response from verify section", response);
        const instanceID = response?.instance_id;
        const instance = {
          instanceID: `${instanceID}`,
          workflowID: `${WORKFLOW_ID}`,
          connectionID: `${connectionId}`,
          currentState: `${CURRENT_STATE}`,
          stateData: { "threadId": `${threadId}` }
        }
        await this.workflowService.updateInstanceByID(connectionId, WORKFLOW_ID, CURRENT_STATE, {threadId: threadId});
        await this.acapyService.sendMessage(connectionData.connection_id,instance.workflowID)
  }
  
  private extractStudentNumber(alias: string): string | null {
    const parts = alias.split(' -studentID- ');
    return parts.length > 1 ? parts[1] : null;
  }

  private createAttributes(studentIdCred: any): any[] {
    return [
      { name: 'Last', value: studentIdCred.lastName ?? '' },
      { name: 'School', value: this.configService.get<string>('SCHOOL') ?? '' },
      {
        name: 'Expiration',
        value: this.configService.get<string>('STUDENTID_EXPIRATION') ?? '',
      },
      { name: 'First', value: studentIdCred.firstName ?? '' },
      { name: 'StudentID', value: studentIdCred.studentsId ?? '' },
      { name: 'Middle', value: studentIdCred.middleName ?? '' },
    ];
  }

  // private createFallbackAttributes(alias: string): any[] {
  //   return [
  //     { name: 'Last', value: alias ?? '' },
  //     { name: 'School', value: this.configService.get<string>('SCHOOL') ?? '' },
  //     {
  //       name: 'Expiration',
  //       value: this.configService.get<string>('STUDENTID_EXPIRATION') ?? '',
  //     },
  //     { name: 'First', value: alias ?? '' },
  //     { name: 'StudentID', value: alias ?? '' },
  //     { name: 'Middle', value: alias ?? '' },
  //   ];
  // }

  private emitEvent(connectionData: any, attributes: any, credDefId: string) {
    this.eventsGateway.sendEventUpdate({
      attributes: attributes,
      timestamp: new Date(),
      details: connectionData,
      cred_def_id: credDefId,
    });
  }
}
