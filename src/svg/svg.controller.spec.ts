import { Test, TestingModule } from '@nestjs/testing';
import { SvgController } from './svg.controller';
import { SvgService } from './svg.service';

describe('SvgController', () => {
  let controller: SvgController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SvgController],
      providers: [
        {
          provide: SvgService,
          useValue: {
            // Mock any methods from SvgService that SvgController uses
            getSvg: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SvgController>(SvgController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});