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
      const studentTranscript: any = await this.sisService.getStudentTranscript(studentID);
      console.log("studentTranscript", studentTranscript);
    
      let studentInfo: any = {}
      let transcript: any = {}

      studentInfo.studentPhone =  (studentTranscript?.studentPhone==undefined) ? " " : studentTranscript?.studentPhone.toString()
      studentInfo.studentEmail =  (studentTranscript?.studentEmail==undefined) ? " " : studentTranscript?.studentEmail.toString()
      studentInfo.studentAddress =  (studentTranscript?.studentAddress==undefined) ? " " : studentTranscript?.studentAddress.toString()
      studentInfo.studentSsn =  (studentTranscript?.studentSsn==undefined) ? " " : studentTranscript?.studentSsn.toString()
      studentInfo.studentSex =  (studentTranscript?.studentSex==undefined) ? " " : studentTranscript?.studentSex.toString()
      studentInfo.studentContacts =  (studentTranscript?.studentContacts==undefined) ? " " : studentTranscript?.studentContacts.toString()
      studentInfo.studentStateId =  (studentTranscript?.studentStateId==undefined) ? " " : studentTranscript?.studentStateId.toString()
      studentInfo.schoolName =  (studentTranscript?.schoolName==undefined) ? " " : studentTranscript?.schoolName.toString()
      studentInfo.schoolAddress =  (studentTranscript?.schoolAddress==undefined) ? " " : studentTranscript?.schoolAddress.toString()
      studentInfo.schoolPhone =  (studentTranscript?.schoolPhone==undefined) ? " " : studentTranscript?.schoolPhone.toString()
      studentInfo.schoolFax =  (studentTranscript?.schoolFax==undefined) ? " " : studentTranscript?.schoolFax.toString()
      studentInfo.schoolCode =  (studentTranscript?.schoolCode==undefined) ? " " : studentTranscript?.schoolCode.toString()
      studentInfo.schoolDistrict =  (studentTranscript?.schoolDistrict==undefined) ? " " : studentTranscript?.schoolDistrict.toString()
      studentInfo.schoolDistrictPhone =  (studentTranscript?.schoolDistrictPhone==undefined) ? " " : studentTranscript?.schoolDistrictPhone.toString()
      studentInfo.schoolAccreditation =  (studentTranscript?.schoolAccreditation==undefined) ? " " : studentTranscript?.schoolAccreditation.toString()
      studentInfo.schoolCeebCode =  (studentTranscript?.schoolCeebCode==undefined) ? " " : studentTranscript?.schoolCeebCode.toString()
      studentInfo.schoolPrincipal =  (studentTranscript?.schoolPrincipal==undefined) ? " " : studentTranscript?.schoolPrincipal.toString()
      studentInfo.schoolPrincipalPhone =  (studentTranscript?.schoolPrincipalPhone==undefined) ? " " : studentTranscript?.schoolPrincipalPhone.toString()
      studentInfo.schoolGradeLevels =  (studentTranscript?.schoolGradeLevels==undefined) ? " " : studentTranscript?.schoolGradeLevels.toString()
      studentInfo.guardianName =  (studentTranscript?.guardianName==undefined) ? " " : studentTranscript?.guardianName.toString()
      studentInfo.guardianPhone =  (studentTranscript?.guardianPhone==undefined) ? " " : studentTranscript?.guardianPhone.toString()
      studentInfo.guardianEmail =  (studentTranscript?.guardianEmail==undefined) ? " " : studentTranscript?.guardianEmail.toString()
      studentInfo.gradeLevel =  (studentTranscript?.gradeLevel==undefined) ? " " : studentTranscript?.gradeLevel.toString()
      studentInfo.graduationDate =  (studentTranscript?.graduationDate==undefined) ? " " : studentTranscript?.graduationDate.toString()
      studentInfo.workExperience =  (studentTranscript?.workExperience==undefined) ? " " : studentTranscript?.workExperience.toString()
      studentInfo.achievements =  (studentTranscript?.achievements==undefined) ? " " : studentTranscript?.achievements.toString()

      transcript.program =  (studentTranscript?.program==undefined) ? " " : studentTranscript?.program.toString()
      transcript.gpa =  (studentTranscript?.gpa==undefined) ? " " : studentTranscript?.gpa.toString()
      transcript.gpaUnweighted =  (studentTranscript?.gpaUnweighted==undefined) ? " " : studentTranscript?.gpaUnweighted.toString()
      transcript.totalPoints =  (studentTranscript?.totalPoints==undefined) ? " " : studentTranscript?.totalPoints.toString()
      transcript.totalPointsUnweighted =  (studentTranscript?.totalPointsUnweighted==undefined) ? " " : studentTranscript?.totalPointsUnweighted.toString()
      transcript.classRank =  (studentTranscript?.classRank==undefined) ? " " : studentTranscript?.classRank.toString()
      transcript.attemptedCredits =  (studentTranscript?.attemptedCredits==undefined) ? " " : studentTranscript?.attemptedCredits.toString()
      transcript.earnedCredits =  (studentTranscript?.earnedCredits==undefined) ? " " : studentTranscript?.earnedCredits.toString()
      transcript.requiredCredits =  (studentTranscript?.requiredCredits==undefined) ? " " : studentTranscript?.requiredCredits.toString()
      transcript.remainingCredits =  (studentTranscript?.remainingCredits==undefined) ? " " : studentTranscript?.remainingCredits.toString()
      transcript.endorsements =  (studentTranscript?.endorsements==undefined) ? " " : studentTranscript?.endorsements.toString()
      transcript.mathRigor =  (studentTranscript?.mathRigor==undefined) ? " " : studentTranscript?.mathRigor.toString()
      transcript.cirriculumProgram =  (studentTranscript?.cirriculumProgram==undefined) ? " " : studentTranscript?.cirriculumProgram.toString()
      transcript.reqirementsRemaining =  (studentTranscript?.reqirementsRemaining==undefined) ? " " : studentTranscript?.reqirementsRemaining.toString()
      transcript.tests =  (studentTranscript?.tests==undefined) ? " " : studentTranscript?.tests.toString()
      transcript.creditSummary =  (studentTranscript?.creditSummary==undefined) ? " " : studentTranscript?.creditSummary.toString()
      transcript.ctePrograms =  (studentTranscript?.ctePrograms==undefined) ? " " : studentTranscript?.ctePrograms.toString()
      transcript.transcriptDate =  (studentTranscript?.transcriptDate==undefined) ? " " : studentTranscript?.transcriptDate.toString()
      transcript.transcriptComments =  (studentTranscript?.transcriptComments==undefined) ? " " : studentTranscript?.transcriptComments.toString()

      // get data for send offer
      const credentialOfferBody = {
        "auto_issue": true,
        "connection_id": connection_id,
        "cred_def_id": cred_def_id,
        "credential_preview": {
          "@type": "issue-credential/1.0/credential-preview",
          "attributes": [
            {
              "name": "studentNumber",
              "value": (studentTranscript?.studentNumber==undefined) ? " " : studentTranscript?.studentNumber.toString()
            },
            {
              "name": "studentFullName",
              "value": (studentTranscript?.studentFullName==undefined) ? " " : studentTranscript?.studentFullName.toString()
            },
            {
              "name": "studentBirthDate",
              "value": (studentTranscript?.studentBirthDate==undefined) ? " " : studentTranscript?.studentBirthDate.toString()
            },
            {
              "name": "terms",
              "value": (studentTranscript?.terms==undefined) ? " " : studentTranscript?.terms.toString()
            },
            {
              "name": "studentInfo",
              "value": JSON.stringify(studentInfo)
            },
            {
              "name": "transcript",
              "value": JSON.stringify(transcript)
            }
/* 
            {
              "name": "studentSsn",
              "value": (studentTranscript?.studentSsn==undefined) ? " " : studentTranscript?.studentSsn.toString()
            },
            {
              "name": "studentSex",
              "value": (studentTranscript?.studentSex==undefined) ? " " : studentTranscript?.studentSex.toString()
            },
            {
              "name": "studentContacts",
              "value": (studentTranscript?.studentContacts==undefined) ? " " : studentTranscript?.studentContacts.toString()
            },
            {
              "name": "studentStateId",
              "value": (studentTranscript?.studentStateId==undefined) ? " " : studentTranscript?.studentStateId.toString()
            },
            {
              "name": "guardianName",
              "value": (studentTranscript?.guardianName==undefined) ? " " : studentTranscript?.guardianName.toString()
            },
            {
              "name": "guardianPhone",
              "value": (studentTranscript?.guardianPhone==undefined) ? " " : studentTranscript?.guardianPhone.toString()
            },
            {
              "name": "guardianEmail",
              "value": (studentTranscript?.guardianEmail==undefined) ? " " : studentTranscript?.guardianEmail.toString()
            },
            {
              "name": "gradeLevel",
              "value": (studentTranscript?.gradeLevel==undefined) ? " " : studentTranscript?.gradeLevel.toString()
            },
            {
              "name": "graduationDate",
              "value": (studentTranscript?.graduationDate==undefined) ? " " : studentTranscript?.graduationDate.toString()
            },
            {
              "name": "program",
              "value": (studentTranscript?.program==undefined) ? " " : studentTranscript?.program.toString()
            },
            {
              "name": "schoolName",
              "value": (studentTranscript?.schoolName==undefined) ? " " : studentTranscript?.schoolName.toString()
            },
            {
              "name": "schoolAddress",
              "value": (studentTranscript?.schoolAddress==undefined) ? " " : studentTranscript?.schoolAddress.toString()
            },
            {
              "name": "schoolPhone",
              "value": (studentTranscript?.schoolPhone==undefined) ? " " : studentTranscript?.schoolPhone.toString()
            },
            {
              "name": "schoolFax",
              "value": (studentTranscript?.schoolFax==undefined) ? " " : studentTranscript?.schoolFax.toString()
            },
            {
              "name": "schoolCode",
              "value": (studentTranscript?.schoolCode==undefined) ? " " : studentTranscript?.schoolCode.toString()
            },
            {
              "name": "schoolDistrict",
              "value": (studentTranscript?.schoolDistrict==undefined) ? " " : studentTranscript?.schoolDistrict.toString()
            },
            {
              "name": "schoolDistrictPhone",
              "value": (studentTranscript?.schoolDistrictPhone==undefined) ? " " : studentTranscript?.schoolDistrictPhone.toString()
            },
            {
              "name": "schoolCeebCode",
              "value": (studentTranscript?.schoolCeebCode==undefined) ? " " : studentTranscript?.schoolCeebCode.toString()
            },
            {
              "name": "schoolPrincipal",
              "value": (studentTranscript?.schoolPrincipal==undefined) ? " " : studentTranscript?.schoolPrincipal.toString()
            },
            {
              "name": "schoolPrincipalPhone",
              "value": (studentTranscript?.schoolPrincipalPhone==undefined) ? " " : studentTranscript?.schoolPrincipalPhone.toString()
            },
            {
              "name": "schoolGradeLevels",
              "value": (studentTranscript?.schoolGradeLevels==undefined) ? " " : studentTranscript?.schoolGradeLevels.toString()
            },
            {
              "name": "gpa",
              "value": (studentTranscript?.gpa==undefined) ? " " : studentTranscript?.gpa.toString()
            },
            {
              "name": "gpaUnweighted",
              "value": (studentTranscript?.gpaUnweighted==undefined) ? " " : studentTranscript?.gpaUnweighted.toString()
            },
            {
              "name": "classRank",
              "value": (studentTranscript?.classRank==undefined) ? " " : studentTranscript?.classRank.toString()
            },            
            {
              "name": "totalPoints",
              "value": (studentTranscript?.totalPoints==undefined) ? " " : studentTranscript?.totalPoints.toString()
            },
            {
              "name": "totalPointsUnweighted",
              "value": (studentTranscript?.totalPointsUnweighted==undefined) ? " " : studentTranscript?.totalPointsUnweighted.toString()
            },
            {
              "name": "attemptedCredits",
              "value": (studentTranscript?.attemptedCredits==undefined) ? " " : studentTranscript?.attemptedCredits.toString()
            },
            {
              "name": "earnedCredits",
              "value": (studentTranscript?.earnedCredits==undefined) ? " " : studentTranscript?.earnedCredits.toString()
            },
            {
              "name": "requiredCredits",
              "value": (studentTranscript?.requiredCredits==undefined) ? " " : studentTranscript?.requiredCredits.toString()
            },
            {
              "name": "remainingCredits",
              "value": (studentTranscript?.remainingCredits==undefined) ? " " : studentTranscript?.remainingCredits.toString()
            },
            {
              "name": "endorsements",
              "value": (studentTranscript?.endorsements==undefined) ? " " : studentTranscript?.endorsements.toString()
            },
            {
              "name": "mathRigor",
              "value": (studentTranscript?.mathRigor==undefined) ? " " : studentTranscript?.mathRigor.toString()
            },
            {
              "name": "cirriculumProgram",
              "value": (studentTranscript?.cirriculumProgram==undefined) ? " " : studentTranscript?.cirriculumProgram.toString()
            },
            {
              "name": "reqirementsRemaining",
              "value": (studentTranscript?.reqirementsRemaining==undefined) ? " " : studentTranscript?.reqirementsRemaining.toString()
            },
            {
              "name": "terms",
              "value": (studentTranscript?.terms==undefined) ? " " : studentTranscript?.terms.toString()
            },
            {
              "name": "workExperience",
              "value": (studentTranscript?.workExperience==undefined) ? " " : studentTranscript?.workExperience.toString()
            },
            {
              "name": "achievements",
              "value": (studentTranscript?.achievements==undefined) ? " " : studentTranscript?.achievements.toString()
            },
            {
              "name": "tests",
              "value": (studentTranscript?.tests==undefined) ? " " : studentTranscript?.tests.toString()
            },
            {
              "name": "creditSummary",
              "value": (studentTranscript?.creditSummary==undefined) ? " " : studentTranscript?.creditSummary.toString()
            },
            {
              "name": "ctePrograms",
              "value": (studentTranscript?.ctePrograms==undefined) ? " " : studentTranscript?.ctePrograms.toString()
            },
            {
              "name": "transcriptDate",
              "value": (studentTranscript?.transcriptDate==undefined) ? " " : studentTranscript?.transcriptDate.toString()
            },
            {
              "name": "transcriptComments",
              "value": (studentTranscript?.transcriptComments==undefined) ? " " : studentTranscript?.transcriptComments.toString()
            },
            {
              "name": "schoolAccreditation",
              "value": (studentTranscript?.schoolAccreditation==undefined) ? " " : studentTranscript?.schoolAccreditation.toString()
            }
 */            
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
                "name": "StudentNumber",
                "value": studentInfo.studentNumber
              },
              {
                "name": "FullName",
                "value": studentInfo.studentFullName
              },
              {
                "name": "SchoolName",
                "value": studentInfo.schoolName
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