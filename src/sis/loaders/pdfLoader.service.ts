

import { Injectable } from "@nestjs/common";
import { SisLoaderService } from "./sisLoader.service";
import { StudentIdDto } from "../../dtos/studentId.dto";
import { HighSchoolTranscriptDto, TranscriptDto } from "../../dtos/transcript.dto";
import { ConfigService } from "@nestjs/config";
import * as Zip from 'adm-zip';
import * as Pdf from 'pdf-parse'
import { RedisService } from "../../services/redis.service";

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
        
        const studentNumberBlock = pdfText.filter(str => str.startsWith("Student Number:"))[0];
        // "Student Number: ########"
        studentId.studentNumber = studentNumberBlock.match(/\d+/)[0];

        return [studentId, transcript];
    }    
}
