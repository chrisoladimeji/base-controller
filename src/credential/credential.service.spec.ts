import { Test, TestingModule } from '@nestjs/testing';
import { CredentialService } from './credential.service';
import { MetadataService } from '../metadata/metadata.service';
import { AcaPyService } from '../services/acapy.service';
import { EventsGateway } from '../events/events.gateway';
import { WorkflowService } from '../workflow/workflow.service';

describe('CredentialService', () => {
  let service: CredentialService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CredentialService,
        { provide: MetadataService, useValue: {} },
        { provide: AcaPyService, useValue: {} },
        { provide: EventsGateway, useValue: {} },
        { provide: WorkflowService, useValue: {} },
      ],
    }).compile();

    service = module.get<CredentialService>(CredentialService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});