import { Test, TestingModule } from '@nestjs/testing';
import { PingController } from './ping.controller';
import { PingService } from './ping.service';

describe('PingController', () => {
  let controller: PingController;
  let service: PingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PingController],
      providers: [
        {
          provide: PingService,
          useValue: {
            // Mock the `getConnections` method that the controller uses
            getConnections: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PingController>(PingController);
    service = module.get<PingService>(PingService);
  });

  // Test to ensure the controller is created successfully
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Test suite for the `ping` method (the POST request)
  describe('ping', () => {
    it('should return "OK"', () => {
      const result = controller.ping({ test: 'data' });
      expect(result).toBe('OK');
    });
  });

  // Test suite for the `getConnections` method (the GET request)
  describe('getConnections', () => {
    it('should call the service and return its result', async () => {
      // 1. Arrange: Setup the mock
      const mockResponse = [{ id: 'conn-123', status: 'active' }];
      jest.spyOn(service, 'getConnections').mockResolvedValue(mockResponse);

      // 2. Act: Call the controller method
      const result = await controller.getConnections();

      // 3. Assert: Check the results
      expect(result).toEqual(mockResponse); // Did it return the mock data?
      expect(service.getConnections).toHaveBeenCalled(); // Was the service called?
    });
  });
});