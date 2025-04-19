import { IActionExtension, Transition, Instance } from "@veridid/workflow-parser";
import { AcaPyService } from "src/services/acapy.service";
import { Injectable } from "@nestjs/common";
import { SisService } from "src/sis/sis.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ExtendedAction implements IActionExtension {

    constructor(
      private readonly configService: ConfigService,
      private readonly acapyService: AcaPyService,
      private readonly sisService: SisService
    ) {}

    async actions(actionInput: any, instance: Instance, action: any, transition: Transition): Promise<Transition>{
        console.log("^^^ Extension -> actions");
        const connection_id = instance.client_id;
        const cred_def_id = action?.value?.cred_def;
        console.log("Cred-defID=", cred_def_id);
        // handle the types of actions
        switch(action?.type) {
            case "extension":
                // check condition
                if(eval(action.condition)) {
                    // save the data from the workflow action to the instance data
                    instance.state_data = Object.assign(instance.state_data, action.value);
                }
                break;
            case "issuecredential-StudentCard":
                    console.log("Issue Credential");
                    // check condition
                    if(eval(action.condition)) {
                        // issue the credential
                        console.log("Action=", action);
                        console.log("ActionInput=", actionInput);
                        if(action?.value?.type=="studentID") {
                            await this.sendStudentIDCredOffer(connection_id, cred_def_id);
                        }
                    }
                    break;
                case "issuecredential-Transcript":
                  console.log("Issue Credential");
                  // check condition
                  if(eval(action.condition)) {
                      // issue the credential
                      console.log("Action=", action);
                      console.log("ActionInput=", actionInput);
                      if(action?.value?.type=="transcript") {
                          await this.sendTranscriptCredOffer(connection_id, cred_def_id);
                      }
                  }
                  break;
                case "verifycredential-StudentCard":
                    console.log("Verify Credential");
                    // check condition
                    if(eval(action.condition)) {
                        // issue the credential
                        console.log("Action=", action);
                        console.log("ActionInput=", actionInput);
                        if(action?.value?.type=="transcript") {
                            await this.sendStudentIDProofRequest(connection_id, cred_def_id);
                        }
                    }
                    break;
                case "verifycredential-Transcript":
                  console.log("Verify Credential");
                  // check condition
                  if(eval(action.condition)) {
                      // issue the credential
                      console.log("Action=", action);
                      console.log("ActionInput=", actionInput);
                      if(action?.value?.type=="transcript") {
                          await this.sendTranscriptProofRequest(connection_id, cred_def_id);
                      }
                  }
                  break;
  
                            
          default:
        }
    
        return transition;
    };

    async sendStudentIDProofRequest(connection_id: string, cred_def_id: string) {
    }
    async sendTranscriptProofRequest(connection_id: string, cred_def_id: string) {
    }

    async sendTranscriptCredOffer(connection_id: string, cred_def_id: string) {
      console.log("sendTranscriptCredOffer", connection_id);
      const connectionData = await this.acapyService.getConnectionById(connection_id);
      console.log("ConnectionData=", connectionData);
      const studentID = this.extractStudentNumber(connectionData?.alias).trim();
      console.log("Student ID=", studentID);
      const studentTranscript = await this.sisService.getStudentTranscript(studentID);
      console.log("studentTranscript", studentTranscript);
    
      // get data for send offer
      const credentialOfferBody = {
        "auto_issue": true,
        "connection_id": connection_id,
        "cred_def_id": cred_def_id,
        "credential_preview": {
          "@type": "issue-credential/1.0/credential-preview",
          "attributes": [
            {
              "name": "transcriptDate",
              "value": studentTranscript.transcriptDate
            },
            {
              "name": "transcriptComments",
              "value": studentTranscript.transcriptComments
            },
            {
              "name": "studentNumber",
              "value": studentTranscript.studentNumber
            },
            {
              "name": "studentFullName",
              "value": studentTranscript.studentFullName
            },
            {
              "name": "studentBirthDate",
              "value": studentTranscript.studentBirthDate
            },
            {
              "name": "studentPhone",
              "value": studentTranscript.studentPhone
            },
            {
              "name": "studentEmail",
              "value": studentTranscript.studentEmail
            },
            {
              "name": "studentAddress",
              "value": studentTranscript.studentAddress
            },
            {
              "name": "studentSsn",
              "value": studentTranscript.studentSsn
            },
            {
              "name": "gradeLevel",
              "value": studentTranscript.gradeLevel
            },
            {
              "name": "graduationDate",
              "value": studentTranscript.graduationDate
            },
            {
              "name": "program",
              "value": studentTranscript.program
            },
            {
              "name": "schoolName",
              "value": studentTranscript.schoolName
            },
            {
              "name": "schoolAddress",
              "value": studentTranscript.schoolAddress
            },
            {
              "name": "schoolFax",
              "value": studentTranscript.schoolFax
            },
            {
              "name": "gpa",
              "value": studentTranscript.gpa.toString()
            },
            {
              "name": "gpaUnweighted",
              "value": "" //studentTranscript.gpaUnweighted
            },
            {
              "name": "classRank",
              "value": "" //studentTranscript.classRank
            },
            {
              "name": "terms",
              "value": JSON.stringify(studentTranscript.terms)
            }
          ]
        }
      }
      console.log("Credential offer=", credentialOfferBody);
      console.log("Credential attributes=", credentialOfferBody.credential_preview.attributes);
      await this.acapyService.sendCredOffer(credentialOfferBody);

  }



    async sendStudentIDCredOffer(connection_id: string, cred_def_id: string) {
        console.log("sendStudentIDCredOffer", connection_id);
        const connectionData = await this.acapyService.getConnectionById(connection_id);
        console.log("ConnectionData=", connectionData);
        const studentID = this.extractStudentNumber(connectionData?.alias).trim();
        console.log("Student ID=", studentID);
        const studentInfo = await this.sisService.getStudentId(studentID);
        console.log("studentInfo", studentInfo);
        // get data for send offer
        const credentialOfferBody = {
          "auto_issue": true,
          "connection_id": connection_id,
          "cred_def_id": cred_def_id,
          "credential_preview": {
            "@type": "issue-credential/1.0/credential-preview",
            "attributes": [
              {
                "name": "First",
                "value": studentInfo.fullName
              },
              {
                "name": "SchoolName",
                "value": studentInfo.schoolName
              },
              {
                "name": "StudentNumber",
                "value": studentInfo.studentNumber
              },
              {
                "name": "Expiration",
                "value": "20260701"
              },
              {
                "name": "CardURL",
                "value": ""
              },
              {
                "name": "BirthDate",
                "value": ""
              },
              {
                "name": "QrcodeFields",
                "value": "StudentNumber"
              },
              {
                "name": "BarcodeFields",
                "value": "StudentNumber"
              },
              {
                "name": "NfcFields",
                "value": "StudentNumber"
              }
            ]
          }
        }
        console.log("Credential offer=", credentialOfferBody);
        console.log("Credential attributes=", credentialOfferBody.credential_preview.attributes);
        await this.acapyService.sendCredOffer(credentialOfferBody);

    }

    private extractStudentNumber(alias: string): string | null {
        const parts = alias.split(' -studentID- ');
        return parts.length > 1 ? parts[1] : null;
    }
}