

import { Injectable } from "@nestjs/common";
import { SisLoaderService } from "./sisLoader.service";
import { StudentIdDto } from "../../dtos/studentId.dto";
import { HighSchoolCourseDto, HighSchoolTermDto, HighSchoolTranscriptDto, TranscriptDto } from "../../dtos/transcript.dto";
import * as Zip from 'adm-zip';
import * as Pdf from 'pdf-parse';
import * as fs from 'fs';
import * as path from "path";
import { RedisService } from "src/services/redis.service";

@Injectable()
export class PdfLoaderService extends SisLoaderService {

    studentIds = {};
    transcripts = {};

    private readonly uploadDir = './uploads' // The docker volume where uploads should go

    constructor(
        private readonly redisService: RedisService
    ) {
        super();
    };

    async load(): Promise<void> {
        
        const files = fs.readdirSync(this.uploadDir);
        const zipFile = files.find((file) => file.endsWith('.zip'));

        if (!zipFile) {
          console.error('No zip file found in the uploads directory');
          return;
        }
        console.log("Loading SIS data from zip file using PDFLoader: ", zipFile)
    
        const zipPath = path.join(this.uploadDir, zipFile);

        let zip = new Zip(zipPath);
        let zipEntries = zip.getEntries();

        let successes = 0;
        let failures = 0;
        for (const zipEntry of zipEntries) {
            if (!zipEntry.entryName.endsWith(".pdf")) {
                continue;
            }

            console.log(`Loading PDF: ${zipEntry.entryName}`);

            const pdfBuffer = await zipEntry.getData();
            let studentId: StudentIdDto;
            let transcript: TranscriptDto;
            try {
                [studentId, transcript] = await this.parsePdfPender(pdfBuffer);
            }
            catch (err) {
                console.error("Error parsing data out of PDF: ", zipEntry.entryName);
                failures++;
                continue;
            }
            try {
                this.redisService.set(`${studentId.studentNumber}:studentId`, JSON.stringify(studentId));
                this.redisService.set(`${studentId.studentNumber}:transcript`, JSON.stringify(transcript));
                console.log("Saved data for student: ", studentId.studentNumber);
                successes++
            }
            catch (err) {
                console.error("Error saving data for student: ", studentId.studentNumber);
                console.error(err);
                failures++;
                continue;
            }
        }
    };

    async getStudentId(studentNumber: string): Promise<StudentIdDto> {
        const studentIdString = JSON.parse(await this.redisService.get(`${studentNumber}:studentId`));
        return studentIdString;
    }

    async getStudentTranscript(studentNumber: string): Promise<TranscriptDto> {
        const studentIdString = JSON.parse(await this.redisService.get(`${studentNumber}:transcript`));
        return studentIdString;
    }

    async getPdfBuffersFromZip(zipPath) {
        console.log(`PDF zip archive at ${zipPath}`);

        let zip = new Zip(zipPath);
        let zipEntries = zip.getEntries();

        let pdfBuffers: Promise<Buffer>[] = [];
        for (const zipEntry of zipEntries) {
            if (zipEntry.entryName.endsWith(".pdf")) {
                console.log(`Loading PDF: ${zipEntry.entryName}`);
                pdfBuffers.push(zipEntry.getData());
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

        const termBlocks: string[][] = this.splitByTerms(pdfText);
        transcript.terms = termBlocks.map(this.parseTerm.bind(this));

        studentId.studentNumber = this.stringAfterField(pdfText, "Student Number");
        studentId.studentFullName = pdfText[8]; // Assuming this index is correct, no need to change
        studentId.studentBirthDate = this.stringAfterField(pdfText, "Birthdate").match(/[\d\/]+/)[0];
        studentId.studentPhone = this.stringAfterField(pdfText, "Tel", 1);
        studentId.gradeLevel = this.stringAfterField(pdfText, "Grade");
        studentId.graduationDate = pdfText[pdfText.indexOf("Graduation Year:") + 1];
        studentId.schoolName = pdfText[1].substring(0, pdfText[1].indexOf(" Official Transcript"));
        studentId.schoolPhone = this.stringAfterField(pdfText, "Tel",);

        transcript.transcriptDate = this.stringAfterField(pdfText, "Generated on");
        transcript.transcriptComments = pdfText.slice(pdfText.indexOf("Comments"), pdfText.length - 1).join(" ");
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
        transcript.schoolFax = this.stringAfterField(pdfText, "Fax");
        transcript.schoolCode = this.stringAfterField(pdfText, "School Code");
        transcript.gpa = parseFloat(this.stringAfterField(pdfText, "Cumulative GPA").match(/[\d\.]+/)[0]);
        transcript.gpaUnweighted = parseFloat(this.stringAfterField(pdfText, "Cumulative GPA", 1).match(/[\d\.]+/)[0]);
        transcript.classRank = this.stringAfterField(pdfText, "Class Rank");

        const creditTotals: string[] = pdfText.filter(str => str.startsWith("Total"))[0]?.match(/\d+\.\d{3}/g) || [];
        if (creditTotals.length === 4) {
            transcript.earnedCredits = parseFloat(creditTotals[1]);
            // transcript.attemptedCredits = parseFloat(creditTotals[0]);
            // transcript.requiredCredits = parseFloat(creditTotals[2]);
            // transcript.remainingCredits = parseFloat(creditTotals[3]);
        }

        transcript.schoolDistrict = this.stringAfterField(pdfText, "District Name");
        transcript.schoolAccreditation = this.stringAfterField(pdfText, "Accreditation");
        transcript.schoolCeebCode = this.stringAfterField(pdfText, "School CEEB Code");
        transcript.schoolPrincipal = this.stringAfterField(pdfText, "Principal");

        return [studentId, transcript];
    }

    splitByTerms(pdfText: string[]): string[][] {
        let termBlocks: string[][] = [];
        let termIndex = -1;
        let isAfterCredit = false;

        // Iterate through text looking for year (ie 2021-2022)
        // Add text to current term
        for (const str of pdfText) {
            if (str.match(/\d{4}-\d{4}/) !== null) {
                termIndex += 1;
                termBlocks.push([]);
                isAfterCredit = false;
            }

            if (termIndex >= 0 && !isAfterCredit) {
                termBlocks[termIndex].push(str);
            }

            if (str.startsWith("Credit:")) {
                isAfterCredit = true;
            }
        }
        return termBlocks;
    }

    parseTerm(termBlock: string[]): HighSchoolTermDto {
        let term = new HighSchoolTermDto();
        try {
            const courseBlocks: string[][] = this.splitByCourses(termBlock);
            term.courses = courseBlocks.map(this.parseCourse.bind(this));

            term.termGradeLevel = this.stringAfterField(termBlock, "Grade");
            term.termYear = termBlock[0];
            term.termSchoolName = this.stringAfterField(termBlock, "#").split(" ").slice(1).join(" ");
            const creditLine: number[] = termBlock.filter(str => str.startsWith("Credit"))[0]?.match(/[\d\.]+/g).map(Number) || [];
            if (creditLine) {
                term.termCredit = creditLine[0];
                term.termGpa = creditLine[1];
                term.termUnweightedGpa = creditLine[2];
            }
        }
        catch (err) {
            console.error("Error parsing term block: ", err);
        }
        return term;
    }

    splitByCourses(termBlock: string[]): string[][] {
        let courseBlocks: string[][] = [];
        let currentBlock = -1;
        let isAfterCredit = false;
        for (const str of termBlock) {
            if (str.match(/\d+[A-Z]+\w+/)) { // The course code begins the string "1234X0 "
                currentBlock++;
                courseBlocks.push([]);
                isAfterCredit = false;
            }

            if (str.startsWith("Credit")) { // The credit/gpa line is the first non-course element
                isAfterCredit = true;
            }

            if (currentBlock >= 0 && !isAfterCredit) {
                courseBlocks[currentBlock].push(str);
            }
        }
        return courseBlocks;
    }

    parseCourse(courseBlock: string[]): HighSchoolCourseDto {
        let course = new HighSchoolCourseDto();
        try {
            course.courseCode = courseBlock[0].split(/\s+/)[0];

            const indexUncRec: number = courseBlock.indexOf("UNC Minimum Requirement")

            const firstTitleLine = courseBlock[0].match(/\s+(.*)/)[1]
            let followingTitleLines = "";
            for (let i = 1; i < courseBlock.length; i++) {
                // If the line is a UNC requirement or only numbers (grades), we're done
                if (i === indexUncRec || !/[a-zA-Z]+/.test(courseBlock[i])) {
                    break;
                }
                followingTitleLines += " " + courseBlock[i];
                
            } 
            course.courseTitle = firstTitleLine + followingTitleLines;
            course.flags = indexUncRec !== -1 ? ["UNC Minimum Requirement"] : [];

            const creditLine = courseBlock[courseBlock.length - 1].split(/\s+/);
            if (creditLine.length === 3) {
                course.grade = creditLine[0];
                course.creditEarned = parseFloat(creditLine[2]);
                course.courseWeight = parseFloat(creditLine[1]);
            }
            else if (creditLine.length == 2) {
                course.grade = courseBlock[courseBlock.length - 2];
                course.creditEarned = parseFloat(creditLine[1]);
                course.courseWeight = parseFloat(creditLine[0]);
            }
        }
        catch (err) {
            console.error("Error parsing course: ", err);
        }

        return course;
    }

    stringAfterField(pdfText: string[], fieldName: string, occurrence: number = 0): string | null {
        let count = 0;
        
        // Loop through the array to find the field
        for (const str of pdfText) {
            if (str.startsWith(fieldName)) {
                // If we are skipping the first occurrence, we skip it
                if (count < occurrence) {
                    count++;
                    continue;
                }
                
                // If this is not the first match (or skipFirst is false), handle the value extraction
                const match = str.match(new RegExp(`${fieldName}\\s*[:\\s]*([\\s\\S]*)`));

                if (match) {
                    const value = match[1].trim();
                    // Return null if the value is empty (or just a colon)
                    return value === "" ? null : value;
                }
            }
        }
    
        // If the field is not found or there's no value, return null
        return null;
    }
}
