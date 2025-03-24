import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get('/')
  getId(@Res() response: Response): string {
    console.log("AppModule Controller")
    return 'ok';
  }
  
}
