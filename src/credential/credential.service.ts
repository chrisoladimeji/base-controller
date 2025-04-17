import { Injectable, Logger } from '@nestjs/common';
import { parse, getWorkflowInstance, updateWorkflowInstanceByID, getWorkflowInstanceByConnectionID } from '@veridid/workflow-parser';
import { MetadataService } from '../metadata/metadata.service';
import { AcaPyService } from '../services/acapy.service';
import { EventsGateway } from '../events/events.gateway';
import { WorkflowService } from 'src/workflow/workflow.service';

interface CredentialData {
  credential_exchange_id: string;
  connection_id: string;
  state: string;
  credential_definition_id: string;
  thread_id?: string;
  [key: string]: any;
}

@Injectable()
export class CredentialService {
  private readonly logger = new Logger(CredentialService.name);

  constructor(
    private readonly metadataService: MetadataService,
    private readonly acapyService: AcaPyService,
    private readonly eventsGateway: EventsGateway,
    private readonly workflowService: WorkflowService
  ) { }

  async handleCredential(credentialData: CredentialData): Promise<void> {
    const { credential_exchange_id, connection_id, state } = credentialData;

/*     if (state === 'offer_sent') {
      this.logger.log('Credential Offer sent...');
      this.emitEvent(credentialData);
      await this.handleStateOfferSentWorkflow(credentialData);
    }
 */
    if (state === 'credential_acked') {
      this.logger.log('Credential Accepted ...');
      this.logger.log('Fetching detailed record using credential_exchange_id:', credential_exchange_id);
      const credentialRecord = await this.acapyService.fetchCredentialRecord(credential_exchange_id);
      // this.logger.log('Credential Record:', credentialRecord);

      const attributes = credentialRecord?.credential_proposal_dict?.credential_proposal?.attributes;

      if (attributes) {
        const { First, Last, StudentID, Expiration } = this.extractAttributes(attributes);

        if (First && Last && StudentID && Expiration) {
          await this.metadataService.updateConnectionMetadata(connection_id, {
            student_id: StudentID,
            first_name: First,
            last_name: Last,
            expiration: Expiration,
          });
        } else {
          this.logger.error('First, Last, ID or Expiration not found in credential attributes.');
        }
      } else {
        this.logger.error('Credential attributes are undefined.');
      }


      await this.handleStateCredAckWorkflow(credentialData);
    }

    // if (state === 'offer_sent' &&
    //   [this.configService.get<string>('STUDENTID_CREDENTIAL_DEFINITION_ID'),
    //   this.configService.get<string>('TRANSCRIPT_CREDENTIAL_DEFINITION_ID')].includes(credentialData.credential_definition_id)
    // ) {
    //   await this.issueCredSendMessage(credentialData);
    // }
  }

  // private async issueCredSendMessage(connectionData: CredentialData): Promise<boolean> {
  //   const connection = connectionData.connection_id;
  //   const messageContent = connectionData.credential_definition_id === this.configService.get<string>('STUDENTID_CREDENTIAL_DEFINITION_ID')
  //     ? this.configService.get<string>('ISSUE_STUDENT_ID_MESSAGE')
  //     : this.configService.get<string>('ISSUE_STUDENT_TRANSCRIPT_MESSAGE');

  //   try {
  //     await this.acapyService.sendMessage(connection, messageContent);
  //     this.logger.log('Issue message sent successfully');
  //     return true;
  //   } catch (error) {
  //     this.logger.error('Error sending issue message:', error.message);
  //     return false;
  //   }
  // }

/*   private async handleStateOfferSentWorkflow(credentialData: CredentialData): Promise<boolean> {
    const WORKFLOW_ID = 'NewStudentOrientation';
    const connectionId = credentialData.connection_id;
    const threadId = credentialData.thread_id;

    let instance = await this.workflowService.getInstanceByID(connectionId, )
    try {
      const response = await getWorkflowInstanceByID(connectionId, WORKFLOW_ID);
      const instanceID = response?.instanceID;
      const instance = {
        instanceID,
        workflowID: WORKFLOW_ID,
        connectionID: connectionId,
        currentState: response?.currentState,
        stateData: { threadId },
      };

      await updateWorkflowInstanceByID(instanceID, instance);
      return true;
    } catch (error) {
      this.logger.error('Error handling state offer sent:', error.message);
      return false;
    }
  } */

  private async handleStateCredAckWorkflow(credentialData: CredentialData): Promise<void> {
    const connectionId = credentialData.connection_id;
    const threadId = credentialData.thread_id;
    const instance = await this.workflowService.getInstanceByData(connectionId, {threadID: threadId});
    if(instance?.client_id===connectionId) {
      const action = {
        workflowID: instance.workflow_id,
        actionID: "credential-issued",
        data: {}
      };           
      const displayData = await this.workflowService.parser.parse(connectionId, action);
      await this.workflowService.sendWorkflow(connectionId, displayData);

    }
  }

  private extractAttributes(attributes: any) {
    const getAttrValue = (name: string) => attributes.find((attr: { name: string }) => attr.name === name)?.value;
    return {
      First: getAttrValue('First'),
      Last: getAttrValue('Last'),
      StudentID: getAttrValue('StudentID'),
      Expiration: getAttrValue('Expiration'),
    };
  }

  private emitEvent(data: any) {
    const eventDetails = {
      attributes: data.attributes || [],
      timestamp: new Date(),
      details: data,
    };

    this.eventsGateway.sendEventUpdate(eventDetails);
  }
}

