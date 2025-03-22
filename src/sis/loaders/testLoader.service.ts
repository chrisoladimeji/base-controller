import { Injectable } from "@nestjs/common";
import { SisLoaderService } from "./sisLoader.service";
import { StudentsService } from "../students/students.service";
import { Student } from "../students/student.entity";
import * as jsonData from "../../resources/testStudentDump.json";


@Injectable()
export class TestLoaderService extends SisLoaderService {


    constructor(
        private studentsService: StudentsService
    ) {
        super();
    };

    async load(): Promise<void> {
        console.log('TestLoader: SIS batch load running...')

        let students = [];
        for (let i: number = 0; i < jsonData.length; i++) {
            const student = jsonData[i];
            let parsedStudent = new Student();
            parsedStudent.firstName = student["studentIdCred"]["firstName"];
            parsedStudent.lastName = student["studentIdCred"]["lastName"];
            parsedStudent.fullName = student["studentIdCred"]["fullName"];
            parsedStudent.studentIdNumber = student["studentIdCred"]["studentNumber"];
            students.push(parsedStudent);
        }

        await this.studentsService.insert(students);
        console.log('TestLoader: SIS batch load complete')
    };
}
 