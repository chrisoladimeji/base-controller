import { Injectable } from "@nestjs/common";
import { SisLoaderService } from "./sisLoader.service";
import { StudentsService } from "../students/students.service";
import { Student } from "../students/student.entity";
import { Enrollment } from "../enrollments/enrollment.entity";
import { Session } from "../sessions/session.entity";
import { Course } from "../courses/course.entity";
import { EnrollmentsService } from "../enrollments/enrollments.service";
import { School } from "../schools/school.entity";

import * as studentDump from "../../../test/testStudentDump.json";


@Injectable()
export class TestLoaderService extends SisLoaderService {


    constructor(
        private studentsService: StudentsService,
        private enrollmentsService: EnrollmentsService
    ) {
        super();
    };

    async load(): Promise<void> {
        console.log('TestLoader: SIS batch load running...')

        let students = [];
        let enrollments = []
        let sessions = [];
        let courses = [];
        
        const school = new School("DigiCred University");

        for (const student of studentDump) {
            let parsedStudent = new Student(student["studentIdCred"]["studentNumber"]);
            parsedStudent.fullName = student["studentIdCred"]["fullName"];
            parsedStudent.creditsEarned = student["student-transcript"]["studentCumulativeTranscript"]["cumulativeAttemptedCredits"];
            parsedStudent.gpa = student["student-transcript"]["studentCumulativeTranscript"]["cumulativeGradePointAverage"]


            parsedStudent.enrollments = [];
            for (const courseData of student["student-transcript"]["courseTranscript"]) {
                let parsedEnrollment = new Enrollment();
                parsedEnrollment.grade = courseData["Grade"];
                parsedStudent.enrollments.push(parsedEnrollment);


                // TODO Check insertion of sessions


                // let parsedSession = new Session();
                // let parsedCourse = new Course();
                // let parsedEnrollment = new Enrollment();

                // parsedEnrollment.session = parsedSession;
                // parsedEnrollment.student = parsedStudent;

                // parsedSession.termYear = courseData["syear"];
                // parsedSession.termSeason = courseData["Term"];
                // parsedSession.course = parsedCourse.code;
                // parsedCourse.title = courseData["CourseTitle"];
                // parsedCourse.code = courseData["CourseCode"];
                // parsedCourse.school = school.name;

                // enrollments.push(parsedEnrollment);
                // sessions.push(parsedSession);
                // courses.push(parsedCourse);
            }

            students.push(parsedStudent);
        }

        await this.studentsService.save(students);
        await this.enrollmentsService.save(enrollments);
        // await this.sessionService.insert(sessions);
        // await this.courseService.insert(courses);
        // await this.schoolService.insert(school);
        console.log('TestLoader: SIS batch load complete')
    };
}
