import { Test, TestingModule } from '@nestjs/testing';
import { MetadataController } from './metadata.controller';
import { MetadataService } from './metadata.service'; // <-- 1. Import dependencies
import { ConfigService } from '@nestjs/config';     // <-- 1. Import dependencies

describe('MetadataController', () => {
  let controller: MetadataController;
  let metadataService: MetadataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetadataController],
      providers: [
        // --- 2. Provide mocks for BOTH dependencies ---
        {
          provide: MetadataService,
          useValue: {
            // Add mock methods for any MetadataService function the controller uses
            someMethodTheControllerCalls: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            // The ConfigService typically uses a `get` method
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MetadataController>(MetadataController);
    metadataService = module.get<MetadataService>(MetadataService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // You can now add tests for your controller's methods here
});