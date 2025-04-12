import { Injectable } from "@nestjs/common";
import { SisLoaderService } from "./sisLoader.service";
import * as fs from "fs";
import * as pdf from "pdf-parse";
import { StudentIdDto } from "../../dtos/studentId.dto";
import { TranscriptDto } from "../../dtos/transcript.dto";
import * as sharp from 'sharp'


@Injectable()
export class TestLoaderService extends SisLoaderService {

    exampleStudent = {
        studentName: "Michael Jordan",
        studentNumber: "0023",
        schoolName: "DigiCred High School",

        birthDate: "01/01/2000",
        phone: "(555)-555-5555",
        email: "mj@digicred.com",

        guardianName: "Michael Jordan Sr",
        guardianPhone: "(555)-555-5555",
        guardianEmail: "mjs@digicred.com",

        program: "Geography",
        gradeLevel: "12",
        graduationDate: "5/2025",

        schoolContact: "Jordan Michael",
        schoolPhone: "(555)-555-5555",
    }

    photoURL = "test/sis/sample-id-photo.png";

    constructor() {
        super();
    };

    async load(): Promise<void> {};

    async getStudentId(studentNumber: string): Promise<StudentIdDto> {
        if (studentNumber === this.exampleStudent["studentNumber"]) {
            let studentId = new StudentIdDto;
            studentId.studentNumber = this.exampleStudent["studentNumber"];
            studentId.studentFullName = this.exampleStudent["studentName"];
            studentId.schoolName = this.exampleStudent["schoolName"];            

            studentId.studentBirthDate = this.exampleStudent["birthDate"];
            studentId.studentPhone = this.exampleStudent["phone"];
            studentId.studentEmail = this.exampleStudent["email"];
            studentId.guardianName = this.exampleStudent["guardianName"];
            studentId.guardianPhone = this.exampleStudent["guardianPhone"];
            studentId.guardianEmail = this.exampleStudent["guardianEmail"];
            studentId.program = this.exampleStudent["program"];
            studentId.gradeLevel = this.exampleStudent["gradeLevel"];
            studentId.graduationDate = this.exampleStudent["graduationDate"];

            studentId.schoolContact = this.exampleStudent["schoolContact"];
            studentId.schoolPhone = this.exampleStudent["schoolPhone"];

            try{ 
                let photoBuffer = await sharp(this.photoURL).jpeg({quality: 5, force: true}).toBuffer();
                studentId.studentPhoto = photoBuffer.toString("base64");
                console.log(`StudentID photo successfully loaded`);
            }
            catch (err) {
                console.log(`StudentID photo could not be loaded: ${err}`);
            }

            return studentId;
        }
        return null;
    }

    async getStudentTranscript(studentNumber: string): Promise<TranscriptDto> {
        if (studentNumber === this.exampleStudent["studentNumber"]) {
            let transcript = new TranscriptDto();
            transcript.studentFullName = "Michael Jordan";
            

            let originalFile = fs.readFileSync('test/sis/CFCC_Sampletranscript.pdf');
            const pdfData = await pdf(originalFile);

            console.log(pdfData.text);

            transcript.originalTranscript = pdfData.text;
        }
        return null;
    }
}
