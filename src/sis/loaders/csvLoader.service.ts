import { Injectable } from "@nestjs/common";
import { SisLoaderService } from "./sisLoader.service";
import { RedisService } from "../../services/redis.service";
import { TranscriptDto } from "../../dtos/transcript.dto";
import { StudentIdDto } from "../../dtos/studentId.dto";
import * as path from "path";
import * as fs from "fs";
import * as csv from "csv-parser";
import { validate } from "class-validator";

@Injectable()
export class CsvLoaderService extends SisLoaderService {

    private readonly schoolCodes = {
        "650324": "Edwin A Alderman Elementary",
        "650404": "Wrightsboro Elementary",
        "650408": "Wrightsville Beach Elem",
        "650323": "Edwin A Anderson Elementary",
        "650327": "Eugene Ashley High",
        "650338": "Heyward C Bellamy Elem",
        "650341": "John J Blair Elementary",
        "650304": "Bradley Creek Elementary",
        "650308": "Carolina Beach Elementary",
        "650309": "Castle Hayne Elementary",
        "650366": "Dr John Codington Elem",
        "650316": "College Park Elementary",
        "650353": "Dr Hubert Eaton Sr Elem",
        "650328": "Forest Hills Global Elementary",
        "650312": "R Freeman Sch of Engineering",
        "650342": "John T Hoggard High",
        "650343": "Holly Shelter Middle",
        "650339": "Holly Tree Elementary",
        "650002": "Howe Pre-K Center",
        "650340": "Isaac M Bear Early College High School",
        "650001": "Johnson Pre-K Center",
        "650345": "Lake Forest Academy",
        "650326": "Emsley A Laney High",
        "650355": "Career Readiness Academy at Mosley PLC",
        "650354": "J. C. Roe Center",
        "650310": "Charles P Murray Middle",
        "650348": "Murrayville Elementary",
        "650351": "Myrtle Grove Middle",
        "650352": "New Hanover High",
        "650350": "M C S Noble Middle",
        "650356": "Ogden Elementary",
        "650380": "Masonboro Elementary",
        "650362": "Pine Valley Elementary",
        "650364": "Roland-Grise Middle",
        "650368": "Sunset Park Elementary",
        "650325": "Emma B Trask Middle",
        "650346": "Mary C Williams Elementary",
        "650392": "Williston Middle",
        "650394": "Wilmington Early College High",
        "650400": "Winter Park Model Elementary",
        "650332": "The International School at Gregory",
        "650384": "A H Snipes Academy of Arts/Des",
        "650420": "College Road Early Childhood Center",
        "650395": "SEA-Tech",
        "650330": "Porters Neck Elementary"
      }
      

    private readonly uploadDir = './uploads' // The docker volume where uploads should go
    
    constructor(
        private readonly redisService: RedisService
    ) {
        super();
    };
    
    async load(): Promise<void> {

        const files = fs.readdirSync(this.uploadDir);
        const csvFile = files.find((file) => file.endsWith('.csv'));

        if (!csvFile) {
            console.error('No csv file found in the uploads directory');
            return;
        }
        console.log("Loading SIS data from zip file using PDFLoader: ", csvFile);
        
        const filePath = path.join(this.uploadDir, csvFile);

        return new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (data) => {
                    const studentId = this.parseStudentId(data);
                    try {
                        validate(studentId);
                    }
                    catch (err) {
                        console.error("Could not parse StudentID from line: ", data);
                    }

                    try {
                        this.redisService.set(`${studentId.studentNumber}:studentId`, JSON.stringify(studentId));
                        console.log("Saved data for student: ", studentId.studentNumber);
                    }
                    catch (err) {
                        console.error("Could not save StudentID to Redis: ", studentId.studentNumber);
                    }

                })
                .on('end', () => {
                    resolve();
                })
                .on('error', (error) => {
                    console.error('Error reading CSV file:', error);
                    reject(error);
                });
        });
        
    }

    parseStudentId(data: any): StudentIdDto {
        let studentId = new StudentIdDto();
        studentId.studentNumber = data["Student_Number"] ?? null;
        studentId.studentFullName = `${data["First_Name"]??""} ${data["Last_Name"]??""}`;
        studentId.schoolName = this.schoolCodes[data["SchoolID"] ?? null] ?? null;
        studentId.graduationDate = data["StudentCoreFields.graduation_year"] ?? null;
        return studentId;
    }

    async getStudentId(studentNumber: string): Promise<StudentIdDto> {
        const studentId: StudentIdDto = JSON.parse(await this.redisService.get(`${studentNumber}:studentId`));
        return studentId;
    }

    async getStudentTranscript(studentNumber: string): Promise<TranscriptDto> {
        return null;
    }

}