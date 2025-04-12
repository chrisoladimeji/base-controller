import { Injectable } from "@nestjs/common";
import { SisLoaderService } from "./sisLoader.service";
import { StudentIdDto } from "../../dtos/studentId.dto";
import { HighSchoolTermDto, HighSchoolTranscriptDto, NorthCarolinaCourseDto, TranscriptDto } from "../../dtos/transcript.dto";
import * as sharp from 'sharp'


@Injectable()
export class TestLoaderService extends SisLoaderService {

    exampleStudent = {
        studentNumber: "0023",
        studentFullName: "Michael Jordan",
        studentBirthDate: "01/01/2000",
        studentPhone: "(555)-555-5555",
        studentEmail: "mj@digicred.com",
        studentAddress: "1111 Basketball Ave, Wilmington, NC",
        studentSsn: "111-11-1111",

        guardianName: "Michael Jordan Sr",
        guardianPhone: "(555)-555-5555",
        guardianEmail: "mjs@digicred.com",

        gradeLevel: "12",
        graduationDate: "2025",
        program: "Geography",

        schoolName: "DigiCred High School",
        schoolAddress: "14328 NC Hwy 210, Rocky Point, NC 28457",
        schoolPhone: "(555)-555-5555",
        schoolFax: "(555)-555-5555",

        schoolDistrict: "Secure County Public Schools",
        schoolAccreditation: "SA",
        schoolCeebCode: "555555",
        schoolPrincipal: "John Meyers",

        transcriptDate: "04/12/2025",
        transcriptComments: "Not a real transcript, all grades are simulated",
        
        gpa: 4.1,
        gpaUnweighted: 3.8,
        classRank: "18 of 200",

        attemptedCredits: 28.0,
        earnedCredits: 28.0,
        requiredCredits: 22.0,
        remainingCredits: 0.0,

        terms: [
            {
                termGradeLevel: "8",
                termYear: "2020-2021",
                termSchoolName: "Digital Middle School",
                termCredit: 1.0,
                cumulativeGpa: 0.0,
                cumulativeUnweightedGpa: 0.0,
                courses: [
                    {
                        courseCode: "0001Y0",
                        courseTitle: "Pre-Algebra",
                        grade: "90",
                        courseWeight: 0.0,
                        creditEarned: 1,
                        UncRequirement: true
                    }
                ]
            },
            {
                termGradeLevel: "9",
                termYear: "2021-2022",
                termSchoolName: "DigiCred High School",
                termCredit: 2.0,
                cumulativeGpa: 4.0,
                cumulativeUnweightedGpa: 0.0,
                courses: [
                    {
                        courseCode: "0001X0",
                        courseTitle: "Algebra",
                        grade: "99",
                        courseWeight: 1.0,
                        creditEarned: 1,
                        UncRequirement: true
                    },
                    {
                        courseCode: "0002X0",
                        courseTitle: "English I",
                        grade: "90",
                        courseWeight: 1.0,
                        creditEarned: 1,
                        UncRequirement: true
                    }
                ]
            },
        ]

    }

    photoURL = "test/sis/sample-id-photo.png";

    constructor() {
        super();
    };

    async load(): Promise<void> {};

    async getStudentId(studentNumber: string): Promise<StudentIdDto> {
        if (studentNumber === this.exampleStudent["studentNumber"]) {
            let studentId = new StudentIdDto();

            studentId.studentNumber = this.exampleStudent["studentNumber"];
            studentId.studentFullName = this.exampleStudent["studentFullName"];
            studentId.schoolName = this.exampleStudent["schoolName"];            

            studentId.studentBirthDate = this.exampleStudent["studentBirthDate"];
            studentId.studentPhone = this.exampleStudent["studentPhone"];
            studentId.studentEmail = this.exampleStudent["studentEmail"];
            studentId.guardianName = this.exampleStudent["guardianName"];
            studentId.guardianPhone = this.exampleStudent["guardianPhone"];
            studentId.guardianEmail = this.exampleStudent["guardianEmail"];
            studentId.program = this.exampleStudent["program"];
            studentId.gradeLevel = this.exampleStudent["gradeLevel"];
            studentId.graduationDate = this.exampleStudent["graduationDate"];

            studentId.schoolPhone = this.exampleStudent["schoolPhone"];

            try{ 
                let photoBuffer = await sharp(this.photoURL).jpeg({quality: 3, force: true}).toBuffer();
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
            let transcript = new HighSchoolTranscriptDto();

            transcript.transcriptDate = this.exampleStudent["transcriptDate"];
            transcript.transcriptComments = this.exampleStudent["transcriptComments"];

            transcript.studentNumber = this.exampleStudent["studentNumber"];
            transcript.studentFullName = this.exampleStudent["studentFullName"];
            transcript.studentBirthDate = this.exampleStudent["studentBirthDate"];
            transcript.studentPhone = this.exampleStudent["studentPhone"];
            transcript.studentEmail  = this.exampleStudent["studentEmail"];
            transcript.studentAddress = this.exampleStudent["studentAddress"];
            transcript.studentSsn = this.exampleStudent["studentSsn"];

            transcript.gradeLevel = this.exampleStudent["gradeLevel"];
            transcript.graduationDate = this.exampleStudent["graduationDate"];
            transcript.program = this.exampleStudent["program"];

            transcript.schoolName = this.exampleStudent["schoolName"];
            transcript.schoolAddress = this.exampleStudent["schoolAddress"];
            transcript.schoolFax = this.exampleStudent["schoolFax"];
            
            transcript.gpa = this.exampleStudent["gpa"];
            transcript.gpaUnweighted = this.exampleStudent["gpaUnweighted"];
            transcript.classRank = this.exampleStudent["classRank"];

            transcript.terms = [];
            for (const term of this.exampleStudent["terms"]) {
                let termDto = new HighSchoolTermDto();
                termDto.termGradeLevel = term["termGradeLevel"];
                termDto.termYear = term["termYear"];
                termDto.termSchoolName = term["termSchoolName"];
                termDto.termCredit = term["termCredit"];
                termDto.cumulativeGpa = term["cumulativeGpa"];
                termDto.cumulativeUnweightedGpa = term["cumulativeUnweightedGpa"];

                termDto.courses = [];
                for (const course of term.courses) {
                    let courseDto = new NorthCarolinaCourseDto();
                    courseDto.courseCode = course["courseCode"];
                    courseDto.courseTitle = course["courseTitle"];
                    courseDto.grade = course["grade"];
                    courseDto.creditEarned = course["creditEarned"];
                    courseDto.courseWeight = course["courseWeight"];
                    courseDto.UncRequirement = course["UncRequirement"];

                    termDto.courses.push(courseDto);
                }

                transcript.terms.push(termDto);
            }
            return transcript;
        }
        return null;
    }
}
