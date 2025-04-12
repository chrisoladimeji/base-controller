import { Injectable, OnModuleInit } from '@nestjs/common';
import { Student } from './students/student.entity';
import { StudentsService } from './students/students.service';
import { SisLoaderService } from './loaders/sisLoader.service';
import { ConfigService } from '@nestjs/config';
import { HighSchoolTranscriptDto } from '../dtos/transcript.dto';
import { StudentIdDto } from '../dtos/studentId.dto';
import { validate } from 'class-validator';


@Injectable()
export class SisService implements OnModuleInit {
 
  constructor(
    private studentsService: StudentsService,
    private loaderService: SisLoaderService,
    private configService: ConfigService
  ) {};

  async onModuleInit() {
    this.loaderService.load();
  }

  async getStudentId(studentNumber: string): Promise<StudentIdDto> {
    console.log(`Getting student id: ${studentNumber}`);

    let student: Student = await this.studentsService.getStudent(studentNumber);
    if (!student) {
      console.log('Student not found');
      return null;
    }


    console.log(`Student found: ${student.fullName}`);

    let studentId = new StudentIdDto();

    if (student.id) studentId.studentNumber = student.id
    if (student.fullName) studentId.studentFullName = student.fullName
    if (student.birthDate) studentId.studentBirthDate = student.birthDate.toString();
    if (student.contactName) studentId.studentContactName = student.contactName;
    if (student.contactPhone) studentId.studentContactPhone = student.contactPhone;
    if (student.program) studentId.program = student.program;
    if (student.graduationDate) studentId.graduationDate = student.graduationDate;

    studentId.schoolName = this.configService.get('SCHOOL');
    studentId.expiration = this.configService.get('STUDENTID_EXPIRATION');

    try {
      validate(studentId);
    }
    catch (error) {
      console.log(`StudentId did not have required fields: ${error}`);
      return null;
    }

    return studentId;
  }

  async getStudentTranscript(studentNumber: string): Promise<HighSchoolTranscriptDto> {

    return null;
  }
}
