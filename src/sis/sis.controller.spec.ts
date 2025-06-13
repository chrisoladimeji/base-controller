import { Test, TestingModule } from '@nestjs/testing';
import { SisController } from './sis.controller';
import { SisService } from './sis.service';
import { lastValueFrom, of } from 'rxjs'; // lastValueFrom is still needed

const mockStudent = {
    studentName: 'Michael Jordan',
    studentNumber: '0023',
};

describe('SisController', () => {
    let sisController: SisController;
    let sisService: SisService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SisController],
            providers: [
                {
                    provide: SisService,
                    useValue: {
                        getStudentId: jest.fn().mockReturnValue(of(mockStudent)),
                    },
                },
            ],
        }).compile();

        sisController = module.get<SisController>(SisController);
        sisService = module.get<SisService>(SisService);
    });

    it('should be defined', () => {
        expect(sisController).toBeDefined();
    });

    describe('getStudentId', () => {
        it('should return a student when given a valid number', async () => {
            const studentNumber = '0023';

            // STEP 1: Await the promise from the controller to get the resolved object.
            const responseObject = await sisController.getStudentId(studentNumber);

            // STEP 2: Now that you have the object, access the .studentIdCred property, which contains the Observable.
            const studentObservable$ = responseObject.studentIdCred;

            // STEP 3: Use lastValueFrom to get the final value from that Observable.
            const finalResult = await lastValueFrom(studentObservable$);

            // STEP 4: Assert against the final, unwrapped data.
            expect(finalResult).toEqual(mockStudent);
        });

        // The test for checking if the service was called should also be async now.
        it('should call sisService.getStudentId with the correct student number', async () => {
            const studentNumber = '0023';
            await sisController.getStudentId(studentNumber); // Await the call
            expect(sisService.getStudentId).toHaveBeenCalledWith(studentNumber);
        });
    });
});