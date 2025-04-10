import { Test } from "@nestjs/testing";
import { SisService } from "./sis.service";
import { StudentsService } from "./students/students.service";
import { SisLoaderService } from "./loaders/sisLoader.service";
import { ConfigService } from "@nestjs/config";
import { Student } from "./students/student.entity";
import { StudentIdDto } from "../dtos/studentId.dto";
import { TestLoaderService } from "./loaders/testLoader.service";

const env = {
    'SCHOOL': 'DigiCred High School',
    'STUDENTID_EXPIRATION': '06/21/21'
}

describe('SisController', () => {

    let sisService: SisService;
    let testLoaderService = new TestLoaderService();

    const testStudentValues = {
        studentNumber: testLoaderService.exampleStudent.id,
        studentName: testLoaderService.exampleStudent.name
    }

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
                    provide: SisLoaderService,
                    useValue: {
                        load: jest.fn(testLoaderService.load.bind(testLoaderService)),
                        getStudentId: jest.fn(testLoaderService.getStudentId.bind(testLoaderService)),
                        getStudentTranscript: jest.fn(testLoaderService.getStudentTranscript.bind(testLoaderService))
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

        const expectedDto = new StudentIdDto();
        expectedDto.studentNumber = testStudentValues.studentNumber;
        expectedDto.studentFullName = testStudentValues.studentName;
        expectedDto.schoolName = env.SCHOOL;
        expectedDto.expiration = env.STUDENTID_EXPIRATION;

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
