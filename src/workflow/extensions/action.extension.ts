import { ConfigService } from "@nestjs/config";
import { IActionExtension, Transition, Instance } from "@veridid/workflow-parser";
import { AcaPyService } from "src/services/acapy.service";
import { SisService } from "src/sis/sis.service";
import { WorkflowService } from "../workflow.service";
import { HttpService } from "@nestjs/axios";
import { StudentsService } from "src/sis/students/students.service";
import { SisLoaderService } from "src/sis/loaders/sisLoader.service";
import { TestLoaderService } from "src/sis/loaders/testLoader.service";
import { EnrollmentsService } from "src/sis/enrollments/enrollments.service";
import { Student } from "src/sis/students/student.entity";
import { Repository } from "typeorm";
import { Enrollment } from "src/sis/enrollments/enrollment.entity";
import { throws } from "assert";
import { Injectable } from "@nestjs/common";
import { Client } from 'pg';

@Injectable()
export class ExtendedAction implements IActionExtension {

    private acapyService: AcaPyService;
    private httpService: HttpService;
    private configService: ConfigService;
    //private sisService: SisService;
    private studentsService: StudentsService;
    private loaderService: TestLoaderService;
    private enrollmentsService: EnrollmentsService;
    private studentsRepository: Repository<Student>; 
    private enrollmentRepository: Repository<Enrollment>;   

    public dbClient: Client; 

    constructor() {
        this.httpService = new HttpService();
        this.configService = new ConfigService();
        this.acapyService = new AcaPyService(this.httpService, this.configService);

        let dbClient = {
            user: this.configService.get<string>('WORKFLOW_DB_USER', 'postgres'),
            password: this.configService.get<string>('WORKFLOW_DB_PASSWORD', 'password123'),
            host: this.configService.get<string>('WORKFLOW_DB_HOST', 'localhost'),
            port: this.configService.get<number>('WORKFLOW_DB_PORT', 5435),
            database: this.configService.get<string>('WORKFLOW_DB_NAME', 'postgres'),
        }
        this.dbClient = new Client(dbClient);
        this.connectDB();
    }

    async connectDB() {
        await this.dbClient.connect();
        console.log("Database connected");
    }

    async actions(actionInput: any, instance: Instance, action: any, transition: Transition): Promise<Transition>{
        console.log("^^^ Extension -> actions");
        // handle the types of actions
        switch(action?.type) {
            case "extension":
                // check condition
                if(eval(action.condition)) {
                    // save the data from the workflow action to the instance data
                    instance.state_data = Object.assign(instance.state_data, action.value);
                }
                break;
            case "issuecredential":
                    console.log("Issue Credential");
                    let connection_id = instance.client_id;
                    let cred_def_id = action?.value?.cred_def;
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
            default:
        }
    
        return transition;
    };

    async sendStudentIDCredOffer(connection_id: string, cred_def_id: string) {
        console.log("sendStudentIDCredOffer", connection_id);
        const connectionData = await this.acapyService.getConnectionById(connection_id);
        console.log("ConnectionData=", connectionData);
        const studentID = this.extractStudentNumber(connectionData?.alias).trim();
        console.log("Student ID=", studentID);
        const studentInfo = await this.dbClient.query('SELECT * FROM student WHERE "id" = $1', [studentID]);
        console.log("studentInfo", studentInfo.rows[0]);
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
                "value": studentInfo.rows[0].fullName
              },
              {
                "name": "Last",
                "value": ""
              },
              {
                "name": "Middle",
                "value": ""
              },
              {
                "name": "School",
                "value": "DigiCred College"
              },
              {
                "name": "StudentID",
                "value": studentInfo.rows[0].id
              },
              {
                "name": "Expiration",
                "value": "20260701"
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