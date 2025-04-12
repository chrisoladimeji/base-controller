import { Injectable } from '@nestjs/common';
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
    console.log("Loading SIS data")
    this.loaderService.load();
    console.log("Loading SIS data finished");
  }

  async getStudentId(studentNumber: string): Promise<StudentIdDto> {
    console.log(`Getting student id: ${studentNumber}`);
    let studentId = await this.loaderService.getStudentId(studentNumber);

    if (!studentId) {
        console.log(`StudentNumber was not found: ${studentNumber}`);
        return null;
    }
    studentId.expiration = this.configService.get('STUDENTID_EXPIRATION');

    try {
      validate(studentId);
    }
    catch (error) {
      console.log(`StudentId did not have required fields: ${error}`);
      return null;
    }
    console.log(`StudentID successfully generated for ${studentNumber}`);
    return studentId;
  }

  async getStudentTranscript(studentNumber: string): Promise<HighSchoolTranscriptDto> {

    return null;
  }
}
