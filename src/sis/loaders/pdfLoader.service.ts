

import { Injectable } from "@nestjs/common";
import { SisLoaderService } from "./sisLoader.service";
import { StudentIdDto } from "../../dtos/studentId.dto";
import { HighSchoolCourseDto, HighSchoolTermDto, HighSchoolTranscriptDto, TranscriptDto } from "../../dtos/transcript.dto";
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
        transcript.classRank = pdfText.filter(str => str.startsWith("Class Rank"))[0]?.substring(10);
        // transcript.attemptedCredits
        // transcript.requiredCredits
        // transcript.remainingCredits

        transcript.schoolDistrict = this.stringAfterColon(pdfText, "District Name");
        transcript.schoolAccreditation = this.stringAfterColon(pdfText, "Accreditation")
        transcript.schoolCeebCode = this.stringAfterColon(pdfText, "School CEEB Code");
        transcript.schoolPrincipal = this.stringAfterColon(pdfText, "Principal");

        const termBlocks: string[][] = this.splitByTerms(pdfText);
        transcript.terms = termBlocks.map(this.parseTerm.bind(this));

        // console.log(studentId);
        // console.log(transcript);


        return [studentId, transcript];
    }

    splitByTerms(pdfText: string[]): string[][] {
        let termBlocks: string[][] = [];
        let currentBlock = -1;
        let isAfterCredit = false;
        for (const str of pdfText) {
            if (str.match(/\d{4}-\d{4}/) !== null) {
                currentBlock += 1;
                termBlocks.push([]);
                isAfterCredit = false;
            }

            if (currentBlock >= 0 && !isAfterCredit) {
                termBlocks[currentBlock].push(str);
            }

            if (str.startsWith("Credit:")) {
                isAfterCredit = true;
            }
        }
        return termBlocks;
    }

    parseTerm(termBlock: string[]): HighSchoolTermDto {
        let term = new HighSchoolTermDto();

        term.termGradeLevel = termBlock.filter(str => str.startsWith("Grade"))[0].match(/\d+/)[0];
        term.termYear = termBlock[0];
        term.termSchoolName = termBlock.filter(str => str.startsWith("#"))[0].split(/#\w+\s+/)[1];
        const creditLine: number[] = termBlock.filter(str => str.startsWith("Credit"))[0].match(/[\d\.]+/g).map(Number);
        term.termCredit = creditLine[0];
        term.termGpa = creditLine[1];
        term.termUnweightedGpa = creditLine[2];

        const courseBlocks: string[][] = this.splitByCourses(termBlock);
        term.courses = courseBlocks.map(this.parseCourse.bind(this));
        console.log(term);
        return term;
    }

    splitByCourses(termBlock: string[]): string[][] {
        let courseBlocks: string[][] = [];
        let currentBlock = -1;
        let isAfterCredit = false;
        for (const str of termBlock) {
            if (str.match(/\d+[A-Z]+\w+/)) { // If a course code is in the string
                currentBlock++;
                courseBlocks.push([]);
                isAfterCredit = false;
            }

            if (str.startsWith("Credit")) { // If we get to the credit/gpa line, we're too far
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

        return course;
    }

    stringAfterColon(pdfText: string[], fieldName: string): string {
        const fullSnippet: string = pdfText.filter(str => str.startsWith(fieldName))[0]
        if (!fullSnippet) {
            return null;
        }
        const selection = fullSnippet.split(/:\s*/)[1]?.trim();
        
        return selection ? selection : null;
    }
}
