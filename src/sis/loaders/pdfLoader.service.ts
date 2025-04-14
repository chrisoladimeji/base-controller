

import { Injectable } from "@nestjs/common";
import { SisLoaderService } from "./sisLoader.service";
import { StudentIdDto } from "../../dtos/studentId.dto";
import { HighSchoolTranscriptDto, TranscriptDto } from "../../dtos/transcript.dto";
import { ConfigService } from "@nestjs/config";
import * as Zip from 'adm-zip';
import * as Pdf from 'pdf-parse'

@Injectable()
export class PdfLoaderService extends SisLoaderService {

    studentIds = {};
    transcripts = {};

    constructor(
        private configService: ConfigService
    ) {
        super();
    };

    async load(): Promise<void> {
        console.log("Loading SIS system using PDFLoader");
        const zipPath = this.configService.get("PDF_ZIP");

        const pdfBuffers = await this.getPdfBuffersFromZip(zipPath);
        for (const pdfBuffer of pdfBuffers) {
            let studentId, transcript = await this.parsePdfPender(pdfBuffer);
        }
    };

    async getStudentId(studentNumber: string): Promise<StudentIdDto> {
        return null;
    }

    async getStudentTranscript(studentNumber: string): Promise<TranscriptDto> {
        return null;
    }

    async getPdfBuffersFromZip(zipPath) {
        console.log(`PDF zip archive at ${zipPath}`);

        let zip = new Zip(zipPath);
        let zipEntries = zip.getEntries();

        let pdfBuffers = [];
        for (const zipEntry of zipEntries) {
            if (zipEntry.entryName.endsWith(".pdf")) {
                console.log(`Loading PDF: ${zipEntry.entryName}`);
                pdfBuffers.push(await zipEntry.getData());
            }
        };

        return pdfBuffers;
    }

    async parsePdfPender(pdfBuffer: Buffer): Promise<[StudentIdDto, HighSchoolTranscriptDto]> {
        let studentId = new StudentIdDto();
        let transcript = new HighSchoolTranscriptDto();
        let pdfParser = await Pdf(pdfBuffer);
        const pdfText = pdfParser.text.split(/(\n| {3})/)
            .map(str => String(str).trim())
            .filter(str => str);

        console.log(pdfText);

        // "Student Number: ########"
        studentId.studentNumber = pdfText.filter(str => str.startsWith("Student Number:"))[0]?.match(/\d+/)[0];
        studentId.studentFullName = pdfText[8];
        studentId.studentBirthDate = pdfText.filter(str => str.startsWith("Birthdate:"))[0].match(/\d+\/\d+\/\d+/)[0];
        studentId.studentPhone = pdfText.filter(str => str.startsWith("Tel:"))[1]?.split(": ")[1];
        studentId.gradeLevel = pdfText.filter(str => str.startsWith("Grade:"))[0]?.split(": ")[1];
        studentId.graduationDate = pdfText[pdfText.indexOf("Graduation Year:") + 1];
        studentId.schoolName = pdfText[1].substring(0, pdfText[1].indexOf(" Official Transcript"));
        studentId.schoolPhone = pdfText.filter(str => str.startsWith("Tel:"))[0]?.split(": ")[1];

        transcript.transcriptDate = pdfText.filter(str => str.startsWith("Generated on"))[0]?.match(/\d+\/\d+\/\d+/)[0];
        // transcript.transcriptComments
        transcript.studentNumber = studentId.studentNumber;
        transcript.studentFullName = studentId.studentFullName;
        transcript.studentBirthDate = studentId.studentBirthDate;
        transcript.studentPhone = studentId.studentPhone;
        transcript.studentAddress = pdfText[12];
        transcript.gradeLevel = studentId.gradeLevel;
        transcript.graduationDate = studentId.graduationDate;
        transcript.schoolName = studentId.schoolName;
        transcript.schoolPhone = studentId.schoolPhone;
        transcript.schoolAddress = pdfText[7];
        transcript.schoolFax = pdfText.filter(str => str.startsWith("Fax:"))[0]?.split(": ")[1];
        transcript.schoolCode = pdfText.filter(str => str.startsWith("School Code:"))[0]?.split(": ")[1];
        transcript.gpa = parseFloat(pdfText.filter(str => str.startsWith("Cumulative GPA"))[0].match(/\d\.\d+/)[0]);
        // transcript.earnedCredits
        transcript.gpaUnweighted = parseFloat(pdfText.filter(str => str.startsWith("Cumulative GPA"))[1].match(/\d\.\d+/)[0]);

        console.log(studentId);
        console.log(transcript);

        return [studentId, transcript];
    }    
}
