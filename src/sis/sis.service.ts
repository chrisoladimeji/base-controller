import { Injectable, OnModuleInit } from '@nestjs/common';
import { Student } from './students/student.entity';
import { StudentsService } from './students/students.service';
import { SisLoaderService } from './loaders/sisLoader.service';
import { ConfigService } from '@nestjs/config';
import { HighSchoolTranscriptDto } from '../dtos/transcript.dto';
import { StudentIdDto } from '../dtos/studentId.dto';
import { validate } from 'class-validator';


@Injectable()
export class SisService {

  constructor(
    private loaderService: SisLoaderService,
    private configService: ConfigService
  ) {};

  async load() {
    this.loaderService.load();
  }

  async getStudentId(studentNumber: string): Promise<StudentIdDto> {
    console.log(`Getting student id: ${studentNumber}`);

    console.log(typeof( this.loaderService ));

    let studentId = await this.loaderService.getStudentId(studentNumber);

    if (!studentId) {
        console.log(`StudentNumber was not found: ${studentNumber}`);
        return null;
    }

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
