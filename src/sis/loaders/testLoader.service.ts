import { Injectable } from "@nestjs/common";
import { SisLoaderService } from "./sisLoader.service";
import * as fs from "fs";
import * as pdf from "pdf-parse";
import { StudentIdDto } from "../../dtos/studentId.dto";
import { HighSchoolTranscriptDto, TranscriptDto } from "../../dtos/transcript.dto";




@Injectable()
export class TestLoaderService extends SisLoaderService {

    exampleStudent = {
        name: "Michael Jordan",
        id: "0023",
        school: "DigiCred High School",
        expiration: "01/01/2099",
    }

    constructor() {
        super();
    };

    async load(): Promise<void> {};

    async getStudentId(studentNumber: string): Promise<StudentIdDto> {
        if (studentNumber === this.exampleStudent["id"]) {
            let studentId = new StudentIdDto;
            studentId.studentNumber = this.exampleStudent["id"];
            studentId.studentFullName = this.exampleStudent["name"];
            studentId.schoolName = this.exampleStudent["school"];
            studentId.expiration = this.exampleStudent["expiration"];

            //studentId.studentPhoto = fs.readFileSync('test/sis/sample-id-photo.png').toString('base64');

            return studentId;
        }
        return null;
    }

    async getStudentTranscript(studentNumber: string): Promise<TranscriptDto> {
        if (studentNumber === "0001") {
            let transcript = new HighSchoolTranscriptDto();
            transcript.studentFullName = "Michael Jordan";
            

            let originalFile = fs.readFileSync('test/sis/CFCC_Sampletranscript.pdf');
            const pdfData = await pdf(originalFile);

            console.log(pdfData.text);

            transcript.originalTranscript = pdfData.text;
        }
        return null;
    }
}
