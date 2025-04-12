import { Test } from "@nestjs/testing";
import { SisService } from "./sis.service";
import { StudentsService } from "./students/students.service";
import { SisLoaderService } from "./loaders/sisLoader.service";
import { ConfigService } from "@nestjs/config";
import { Student } from "./students/student.entity";
import { StudentIdDto } from "../dtos/studentId.dto";

const env = {
    'SCHOOL': 'DigiCred High School',
    'STUDENTID_EXPIRATION': '06/21/21'
}

const testStudentValues = {
    studentNumber: '0023',
    studentName: 'Michael Jordan'
}


const testStudent = new Student(testStudentValues.studentNumber);
testStudent.fullName = 'Michael Jordan'


const expectedDto = new StudentIdDto();
expectedDto.studentNumber = testStudentValues.studentNumber;
expectedDto.studentFullName = testStudentValues.studentName;
expectedDto.schoolName = env.SCHOOL;
expectedDto.expiration = env.STUDENTID_EXPIRATION;

describe('SisController', () => {

    let sisService: SisService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                SisService,
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn((key: string) => {
                            return env[key];
                        })
                    }
                },
                {
                    provide: StudentsService,
                    useValue: {
                        save: jest.fn(),
                        getStudent: jest.fn((studentNumber: string) => {
                            if (studentNumber === testStudent.id) return Promise.resolve(testStudent)
                            else return null;
                        })
                    }
                },
                {
                    provide: SisLoaderService,
                    useValue: {
                        load: jest.fn(),
                    }
                }
            ],
        }).compile()

        sisService = module.get(SisService);
    })

    it('is defined', () => {
        expect(sisService).toBeDefined();
    });

    describe('getStudentId', () => {
        it('returns a studentid when given a student number', async () => {
            const response = await sisService.getStudentId(testStudentValues.studentNumber);
            
            expect(response).toEqual(expectedDto);
        })

        it('returns null when studentid cannot be generated', async () => {
            const response = await sisService.getStudentId('Fake student id');
            
            expect(response).toBeNull();
        })
    })

    describe('getStudentTranscript', () => {

    })
})
