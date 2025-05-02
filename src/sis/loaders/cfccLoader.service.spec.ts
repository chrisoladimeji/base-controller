import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { CfccLoaderService } from './cfccLoader.service';
import { EllucianService } from '../../ellucian/ellucian.service';
import { ConfigService } from '@nestjs/config';

const env = {
    "PHOTOID_BASE_URL": "https://test-img-srv.cfcc.edu/images",
    "PHOTOID_FILE_TYPE": "jpg"
}

describe('CfccLoaderService', () => {
  let service: CfccLoaderService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        CfccLoaderService,
        {
            provide: ConfigService,
            useValue: {
                get: jest.fn((key: string) => {
                    return env[key];
                })
            }
        },
        {
          provide: EllucianService,
          useValue: {
            getStudentId: jest.fn().mockResolvedValue({ id: '123456' }),
            getStudentTranscript: jest.fn().mockResolvedValue({ transcript: 'mock-transcript' }),
          },
        },
      ],
    }).compile();

    service = module.get<CfccLoaderService>(CfccLoaderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getStudentPhoto', () => {
    it('should fetch and return base64-encoded JPEG image', async () => {
      const base64Photo = await service.getStudentPhoto("0455838");

      expect(typeof base64Photo).toBe('string');
      expect(base64Photo.length).toBeGreaterThan(0);

    },);
  });
});
