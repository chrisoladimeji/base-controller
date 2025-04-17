import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { parse } from '@veridid/workflow-parser';
import { AcaPyService } from '../services/acapy.service';
import { SisService } from 'src/sis/sis.service';
import { WorkflowService } from '../workflow/workflow.service';

@Injectable()
export class BasicMessagesService {

  constructor(
    private readonly configService: ConfigService,
    private readonly acapyService: AcaPyService,
    private readonly sisService: SisService,
    private readonly workflowService: WorkflowService
  ) { }

  // Method to validate JSON format
  async isValidJsonFormat(content: string): Promise<boolean> {
    try {
      const parsedContent = JSON.parse(content);
      return typeof parsedContent.workflowID === 'string' &&
        typeof parsedContent.actionID === 'string' &&
        typeof parsedContent.data === 'object';
    } catch (e) {
      return false;
    }
  }

  // Main method to process messages
  async processMessage(messageData: any): Promise<void> {
    const connectionId: string = messageData.connection_id;

    // Handle JSON format workflow messages
    if (await this.isValidJsonFormat(messageData.content)) {
      let response: any;
      const parsedContent = JSON.parse(messageData.content);
      const action = {
        workflowID: parsedContent.workflowID,
        actionID: parsedContent.actionID,
        data: parsedContent.data,
      };

      try {
        let displayData = await this.workflowService.parser.parse(connectionId, action);
        console.log("About to send=", displayData);
        this.workflowService.sendWorkflow(connectionId, displayData);
      } catch (error) {
        console.error('Error parsing workflow:', error.message);
        return;
      }
    }
/* 
      if (response.displayData) {
        const hasAgentType = response.displayData.some((item: any) => item.type === 'agent');
        if (hasAgentType) {
          const agentItems = response.displayData.filter((item: any) => item.type === 'agent');
          for (const agentItem of agentItems) {
            if (agentItem.process === 'verification') {
              await this.acapyService.sendProofRequest(connectionId, agentItem.data);
            } else if (agentItem.process === 'issuance') {
              this.issueStudentId(agentItem, connectionId);
            } else if (agentItem.process === 'connection') {
              if (agentItem.data?.actionRequested === 'getTranscript') {
                this.issueTranscript(response, connectionId)
              }
            }
          }
          // Filter out the content with type 'agent'
          const filteredDisplayData = response.displayData.filter((item: any) => item.type !== 'agent');
          // Construct modified response
          const modifiedResponse = { ...response, displayData: filteredDisplayData };
          // Send workflow response message with filtered displayData
          await this.acapyService.sendMessage(connectionId, JSON.stringify(modifiedResponse));
        } else {
          // Send workflow response message as it is
          await this.acapyService.sendMessage(connectionId, JSON.stringify(response));
        }
      } else {
        // Default message if no displayData
        await this.acapyService.sendMessage(connectionId, "Action Menu Feature Not Available For this Connection!");
      }
    }

    // Handle home menu (root menu) requests
    if (messageData.content === ':menu') {
      const action = { workflowID: 'root-menu', actionID: '', data: {} };
      let response: any;

      try {
        response = await parse(connectionId, action);
      } catch (error) {
        console.error('Error parsing workflow:', error.message);
        return;
      }
      if (response.displayData) {
        await this.acapyService.sendMessage(connectionId, JSON.stringify(response));
      } else {
        await this.acapyService.sendMessage(connectionId, "Action Menu Feature Not Available For this Connection!");
      }
    }
  }

  private async invokeWorkflowParser(connectionId: string, action: object): Promise<void> {
    let response: any;

    try {
      response = await parse(connectionId, action);
    } catch (error) {
      console.error('Error parsing workflow:', error.message);
      return;
    }
    if (response.displayData) {
      await this.acapyService.sendMessage(connectionId, JSON.stringify(response));
    } else {
      await this.acapyService.sendMessage(connectionId, "Action Menu Feature Not Available For this Connection!");
    }
  }

  private async issueStudentId(agentItem, connectionId) {
    if (agentItem.data.cred_def_id === this.configService.get<string>('NEW_ORIENTATION_CRED_DEF_ID')) {
      //get metadata of the connection
      const result = await this.acapyService.getMetadataByConnectionId(connectionId);
      // get data for send offer
      const credentialOfferBody = {
        "auto_issue": true,
        "connection_id": connectionId,
        "cred_def_id": agentItem.data.cred_def_id,
        "credential_preview": {
          "@type": "issue-credential/1.0/credential-preview",
          "attributes": [
            {
              "name": "Title",
              "value": agentItem.data.title
            },
            {
              "name": "Student ID No",
              "value": result.student_id
            },
            {
              "name": "Last Name",
              "value": result.last_name
            },
            {
              "name": "First Name",
              "value": result.first_name
            },
            {
              "name": "Session",
              "value": agentItem.data.session
            }
          ]
        }
      }
      this.acapyService.sendCredOffer(credentialOfferBody);
    }
  }

  private async issueTranscript(response, connectionId) {
    //get metadata by connection id 
    const metadata = await this.acapyService.getMetadataByConnectionId(connectionId);
    if (metadata.student_id) {
      //send basic message while waiting
      await this.acapyService.sendMessage(connectionId, JSON.stringify(response));
      //get student transcript info from Ellucian
      let studentId;
      try {
        studentId = await this.sisService.getStudentTranscript(metadata.student_id);
      } catch (error: any) {
        console.log("Error retrieving from SIS", error);
        //invoke workflow parse
        const action = { workflowID: 'RequestTranscript', actionID: 'metadataNotFound', data: {} };
        await this.invokeWorkflowParser(connectionId, action);
        return;
      }
      if (!studentId?.courseTranscript || studentId?.courseTranscript.length < 1) {
        console.log("Unable to retrieve any transcript data ");
        const action = { workflowID: 'RequestTranscript', actionID: 'metadataNotFound', data: {} };
        await this.invokeWorkflowParser(connectionId, action);
        return;
      }
      // send transcript offer to student
      const courseTranscripts = JSON.stringify(studentId?.courseTranscript);
      const credentialOfferBody = {
        "auto_issue": true,
        "connection_id": connectionId,
        "cred_def_id": `${this.configService.get<string>('TRANSCRIPT_CREDENTIAL_DEFINITION_ID')}`,
        "credential_preview": {
          "@type": "issue-credential/1.0/credential-preview",
          "attributes": [
            {
              "name": "Last",
              "value": `${studentId.studentId[0]?.lastName}`
            },

            {
              "name": "First",
              "value": `${studentId.studentId[0]?.firstName}`
            },
            {
              "name": "Expiration",
              "value": `${this.configService.get<string>('STUDENTID_EXPIRATION')}`
            },
            {
              "name": "StudentID",
              "value": `${studentId.studentId[0]?.studentID}`
            },
            {
              "name": "Middle",
              "value": `${studentId.studentId[0]?.middleName}`
            },
            {
              "name": "Transcript",
              "value": `${courseTranscripts}`
            },
            {
              "name": "School",
              "value": `${this.configService.get<string>('SCHOOL')}`
            },
            {
              "name": "GPA",
              "value": `${studentId.studentCumulativeTranscript[0].cumulativeGradePointAverage}`
            },

                      ]
                    }
                  }
                  try {
                    
                     this.acapyService.sendCredOffer(credentialOfferBody);
                  } catch (error: any) {
                    console.log("Error sending transcripts", error);
                    const action = { workflowID: 'RequestTranscript', actionID: 'metadataNotFound', data: {} };
                    await this.invokeWorkflowParser(connectionId, action);
                    return;
                  }
                  //invoke workflow parse
                  const action = { workflowID: 'RequestTranscript', actionID: 'metadataFound', data: {} };
                  await this.invokeWorkflowParser(connectionId, action);
                  return;
                } else {
                  console.log("No Student Metadata");
                  //invoke workflow parse
                  const action = { workflowID: 'RequestTranscript', actionID: 'metadataNotFound', data: {} };
                  await this.invokeWorkflowParser(connectionId, action);
                  return;
                }
              }
            }
          }
          // Filter out the content with type 'agent'
          const filteredDisplayData = response.displayData.filter((item: any) => item.type !== 'agent');
          // Construct modified response
          const modifiedResponse = { ...response, displayData: filteredDisplayData };
          // Send workflow response message with filtered displayData
          await this.acapyService.sendMessage(connectionId, JSON.stringify(modifiedResponse));
        } else {
          // Send workflow response message as it is
          await this.acapyService.sendMessage(connectionId, JSON.stringify(response));
        }
      } else {
        // Default message if no displayData
        await this.acapyService.sendMessage(connectionId, "Action Menu Feature Not Available For this Connection!");
      }
    }
 */
    // Handle home menu (root menu) requests
    if (messageData.content === ':menu') {
      await this.workflowService.forceDefaultWorkflow(connectionId);
    }



/*   private async invokeWorkflowParser(connectionId: string, action: object): Promise<void> {
    let response: any;

    try {
      response = await parse(connectionId, action);
    } catch (error) {
      console.error('Error parsing workflow:', error.message);
      return;
    }
    if (response.displayData) {
      await this.acapyService.sendMessage(connectionId, JSON.stringify(response));
    } else {
      await this.acapyService.sendMessage(connectionId, "Action Menu Feature Not Available For this Connection!");
    }
  }

*/
  }
}
