import { Test, TestingModule } from '@nestjs/testing';
import { VerificationService } from './verification.service';
import { HttpService } from '@nestjs/axios';
import { AcaPyService } from '../services/acapy.service';
import { ConfigService } from '@nestjs/config';
import { MetadataService } from '../metadata/metadata.service';
import { EnrollmentService } from '../enrollment/enrollment.service';
import { WorkflowService } from '../workflow/workflow.service';


describe('VerificationService', () => {
  let service: VerificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VerificationService,
        { provide: HttpService, useValue: { get: jest.fn() } },
        { provide: AcaPyService, useValue: {} },
        { provide: ConfigService, useValue: { get: jest.fn() } },
        { provide: MetadataService, useValue: {} },
        { provide: EnrollmentService, useValue: {} },
        { provide: WorkflowService, useValue: {} },
      ],
    }).compile();

    service = module.get<VerificationService>(VerificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});