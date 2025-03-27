import { Injectable } from "@nestjs/common";
import { SisLoaderService } from "./sisLoader.service";
import { StudentsService } from "../students/students.service";
import { Student } from "../students/student.entity";
import * as studentDump from "../../resources/testStudentDump.json";
import { Enrollment } from "../enrollments/enrollment.entity";
import { Session } from "../sessions/session.entity";
import { Course } from "../courses/course.entity";
import { School } from "../schools/school.entity";
import { EnrollmentsService } from "../enrollments/enrollments.service";


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
        
        // const school = this.schoolRepository.create({ name: "DigiCred University" });

        for (const student of studentDump) {
            let parsedStudent = new Student();
            parsedStudent.fullName = student["studentIdCred"]["fullName"];
            parsedStudent.id = student["studentIdCred"]["studentNumber"];
            parsedStudent.creditsEarned = student["student-transcript"]["studentCumulativeTranscript"]["cumulativeAttemptedCredits"];
            parsedStudent.gpa = student["student-transcript"]["studentCumulativeTranscript"]["cumulativeGradePointAverage"]

            for (const courseData of student["student-transcript"]["courseTranscript"]) {
                let parsedEnrollment = new Enrollment();
                let parsedSession = new Session();
                let parsedCourse = new Course();

                parsedSession.enrollments = [];
                parsedCourse.sessions = [];
                parsedStudent.enrollments = [];

                parsedEnrollment.grade = courseData["Grade"];
                parsedEnrollment.session = parsedSession;
                parsedEnrollment.student = parsedStudent;

                parsedSession.termYear = courseData["syear"];
                parsedSession.termSeason = courseData["Term"];
                parsedSession.course = parsedCourse;
                parsedSession.enrollments.push(parsedEnrollment);

                parsedCourse.courseTitle = courseData["CourseTitle"];
                parsedCourse.courseCode = courseData["CourseCode"];
                // parsedCourse.school = school;
                parsedCourse.sessions.push(parsedSession);

                parsedStudent.enrollments.push(parsedEnrollment);

                enrollments.push(parsedEnrollment);
                sessions.push(parsedSession);
                courses.push(parsedCourse);
            }

            students.push(parsedStudent);
        }

        await this.studentsService.save(students);
        //await this.enrollmentsService.save(enrollments);
        // await this.sessionService.insert(sessions);
        // await this.courseService.insert(courses);
        // await this.schoolService.insert(school);
        console.log('TestLoader: SIS batch load complete')
    };
}
