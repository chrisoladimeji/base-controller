import { ConfigService } from "@nestjs/config";
import { PdfLoaderService } from "./pdfLoader.service";
import { Test } from "@nestjs/testing";
import { RedisService } from "../../services/redis.service";


const env = {
    'STUDENTID_EXPIRATION': '06/21/21',
    'PDF_ZIP': 'test/sis/pender-transcripts.zip'
}

describe('SisController', () => {

    let pdfLoaderService: PdfLoaderService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                PdfLoaderService,
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn((key: string) => {
                            return env[key];
                        })
                    }
                },
            ],
        }).compile()

        pdfLoaderService = module.get(PdfLoaderService);
    })

    it('is defined', () => {
        expect(pdfLoaderService).toBeDefined();
    });

    describe('load', () => {
        it('loads pdfs into the redis cache', async () => {
            await pdfLoaderService.load();
        })
    })

    describe('getStudentId', () => {

        // const expectedDto = new StudentIdDto();
        // expectedDto.studentNumber = testStudentValues.studentNumber;
        // expectedDto.studentFullName = testStudentValues.studentName;
        // expectedDto.schoolName = testStudentValues.schoolName;
        // expectedDto.expiration = env.STUDENTID_EXPIRATION;

        // it('returns a studentid when given a student number', async () => {
        //     const response: StudentIdDto = await sisService.getStudentId(testStudentValues.studentNumber);
            
        //     expect(response.studentNumber).toEqual(expectedDto.studentNumber);
        //     expect(response.studentFullName).toEqual(expectedDto.studentFullName);
        //     expect(response.schoolName).toEqual(expectedDto.schoolName);
        //     expect(response.expiration).toEqual(env.STUDENTID_EXPIRATION);

        //     validate(response);
        // })

        // it('returns null when studentid cannot be generated', async () => {
        //     const response = await sisService.getStudentId('Fake student id');
            
        //     expect(response).toBeNull();
        // })
    })

    describe('getStudentTranscript', () => {

    })
})
