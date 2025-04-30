import { Test, TestingModule } from '@nestjs/testing';
import { EllucianService } from './ellucian.service';
import { StudentIdDto } from '../dtos/studentId.dto';
import { validate } from 'class-validator';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../services/redis.service';
import { of } from 'rxjs';
import { testPersonsResponse } from '../../test/ellucian/testPersonResponse';
import * as jwt from "jsonwebtoken";
import { CollegeTranscriptDto } from '../dtos/transcript.dto';


const env = {
  "STUDENTID_EXPIRATION": "01011970"
}


describe('EllucianService', () => {
  let service: EllucianService;
  const expectedId = new StudentIdDto();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EllucianService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              return env[key];
            })
          }
        },
        {
          provide: RedisService,
          useValue: {
              get: jest.fn(),
              set: jest.fn(),
          }
        },
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(() => of({data: jwt.sign({}, "test")})),
            get: jest.fn(() => of(
              {
                data: testPersonsResponse
              }
            ))
          }
        }
      ],
    }).compile();

    service = module.get<EllucianService>(EllucianService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getStudentId', () => {
  
    const expectedId = new StudentIdDto();
    expectedId.studentNumber = "0512831";
    expectedId.studentFullName = "Lauren G. Proctor";
    expectedId.studentBirthDate = "2005-06-29";
    expectedId.studentPhone = "910-619-5601";
    expectedId.studentEmail = "lgproctor831@BADmail.cfcc.edu";
    expectedId.expiration = "20250701";

    it('returns a studentid when given a student number', async () => {
      const response: StudentIdDto = await service.getStudentId("0512831");
      expect(response.studentNumber).toEqual(expectedId.studentNumber);
      expect(response.studentFullName).toEqual(expectedId.studentFullName);
      expect(response.schoolName).toEqual(expectedId.schoolName);
      expect(response.expiration).toEqual(env.STUDENTID_EXPIRATION);

      validate(response);
    })

    it('returns null when studentid cannot be generated', async () => {
        // const response = await sisService.getStudentId('Fake student id');
        
        // expect(response).toBeNull();
    })
  })
  
  describe('getStudentTranscript', () => {
      it("returns a transcript when given a student number", async () => {
        const response: CollegeTranscriptDto = new CollegeTranscriptDto();
        response.transcriptDate
        response.transcriptComments
        response.studentNumber
        response.studentFullName
        response.studentBirthDate
        response.studentAddress
        response.studentSsn
        response.program
        response.schoolName
        response.schoolPhone
        response.schoolAddress
        response.gpa
        response.earnedCredits // Total in program
        response.terms
        
        // response.terms[0].termYear
        // response.terms[0].termCredit
        // response.terms[0].termGpa

        // response.terms[0].termSeason
        // response.terms[0].academicStanding

        // response.terms[0].termHoursPossible
        // response.terms[0].termHoursEarned
        // response.terms[0].termGradePoints
        // response.terms[0].cumulativeHoursPossible
        // response.terms[0].cumulativeHoursEarned
        // response.terms[0].cumulativeGradePoints
        // response.terms[0].cumulativeGpa

        // response.terms[0].courses[0].courseCode
        // response.terms[0].courses[0].courseTitle
        // response.terms[0].courses[0].grade
        // response.terms[0].courses[0].creditEarned
        // response.terms[0].courses[0].gradePoints
        // response.terms[0].courses[0].transfer
        // response.terms[0].courses[0].inProgress
        // response.terms[0].courses[0].flags

        // response.terms[0].courses[0].hoursPossible
        // response.terms[0].courses[0].hoursEarned
        // response.terms[0].courses[0].repeat
        // response.terms[0].courses[0].schoolName

        validate(response);
      })
  })
});
