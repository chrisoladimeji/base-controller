import { Test, TestingModule } from '@nestjs/testing';
import { PingService } from './ping.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

describe('PingService', () => {
  let service: PingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PingService, // The service we are testing
        {
          provide: HttpService,
          useValue: {
            // Mock any methods from HttpService that PingService uses
            get: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            // Mock the `get` method from ConfigService
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PingService>(PingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});