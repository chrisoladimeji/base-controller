// src/app.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Response } from 'express';

describe('AppController', () => {
  let controller: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getId()', () => {
    it('should return "ok"', () => {
      // since getId ignores the Response and just returns a string:
      const fakeRes = {} as Response;
      expect(controller.getId(fakeRes)).toBe('ok');
    });
  });
});
