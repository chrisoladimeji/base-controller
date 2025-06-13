import { Test, TestingModule } from '@nestjs/testing';
import { MetadataService } from './metadata.service';
import { AcaPyService } from '../services/acapy.service'; // <-- 1. Import the dependency

describe('MetadataService', () => {
  let service: MetadataService;
  let acapyService: AcaPyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MetadataService, // The actual service we are testing
        {                // <-- 2. The mock for its dependency
          provide: AcaPyService,
          useValue: {
            // Add mock methods for any AcaPyService function that MetadataService uses
            someAcaPyMethod: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MetadataService>(MetadataService);
    acapyService = module.get<AcaPyService>(AcaPyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // You can now add tests for your service's methods here
});