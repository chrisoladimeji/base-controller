import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { CfccLoaderService } from './cfccLoader.service';
import { EllucianService } from '../../ellucian/ellucian.service';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';

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
    it('should fetch and return base64-encoded image', async () => {
      const base64Photo = await service.getStudentPhoto("0455838");

      expect(typeof base64Photo).toBe('string');
      expect(base64Photo.length).toBeGreaterThan(0);

    });

    it("should return null when no photo can be retrieved", async () => {
      const mockHttpService = service['httpService'];
      
      jest.spyOn(mockHttpService, 'get').mockImplementation((url: string) => {
        const mockResponse: AxiosResponse = {
          data: null,
          status: 400,
          statusText: 'Error',
          headers: {},
          config: {
            headers: undefined
          }
        };
        return of(mockResponse);
      })

      const base64Photo = await service.getStudentPhoto("0455838");

      expect(base64Photo).toBeNull();

    });
  });
});