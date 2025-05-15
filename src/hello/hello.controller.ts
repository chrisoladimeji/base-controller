// src/hello/hello.controller.ts
import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { HelloService } from './hello.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Hello')
@Controller('ai_skills')
export class HelloController {
  constructor(private readonly helloService: HelloService) {}

  @Get('transcript')
  @ApiQuery({ name: 'studentNumber', required: true, type: String, description: 'The student number' })
  @ApiResponse({ status: 200, description: 'OpenAI Response' })
  @ApiResponse({ status: 404, description: 'Transcript not found' })
  async getTranscriptResponse(@Query('studentNumber') studentNumber: string): Promise<string> {
    try {
      const result = await this.helloService.getTranscriptAndSendToAI(studentNumber);
      return result;
    } catch (error) {
      console.error(error);
      throw new HttpException(error.message || 'Failed to process request', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}