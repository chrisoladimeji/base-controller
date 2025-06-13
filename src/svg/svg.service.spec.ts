import { Test, TestingModule } from '@nestjs/testing';
import { SvgService } from './svg.service';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

describe('SvgService', () => {
  let service: SvgService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SvgService, // The service we are testing
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SvgService>(SvgService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});