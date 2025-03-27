import { Controller, Get, HttpException, HttpStatus, Query, Res } from '@nestjs/common';
import { SisService } from './sis.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('SIS')
@Controller()
export class SisController {
  constructor(private readonly sisService: SisService) {}

  @Get('student-id')
  @ApiOperation({ summary: 'Retrieve student name by student number' })
  @ApiQuery({ name: 'studentNumber', required: true, type: String, description: 'The student number' })
  @ApiResponse({ status: 200, description: 'The student name' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async getStudentId(@Query('studentNumber') studentNumber: string) {
      let studentIdCred={}
      try {
          studentIdCred=await this.sisService.getStudentId(studentNumber);
      } catch (error) {
          throw new HttpException('Failed to retrieve student information', HttpStatus.INTERNAL_SERVER_ERROR);
      }
      return studentIdCred;
  }

  @Get('cumulative-transcript')
  @ApiOperation({ summary: 'Retrieve student transcript by student number' })
  @ApiQuery({ name: 'studentNumber', required: true, type: String, description: 'The student number' })
  @ApiResponse({ status: 200, description: 'The student transcript' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async getStudentTranscript(@Query('studentNumber') studentNumber: string) {
      let transcript={}
      try {
          transcript=this.sisService.getCumulativeTranscript(studentNumber);
      } catch (error) {
          throw new HttpException('Failed to retrieve student information', HttpStatus.INTERNAL_SERVER_ERROR);
      }
      return transcript;
  }

  @Get('student-transcript')
  @ApiOperation({ summary: 'Retrieve student transcript by student number' })
  @ApiQuery({ name: 'studentNumber', required: true, type: String, description: 'The student number' })
  @ApiResponse({ status: 200, description: 'The student transcript' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async getCourseTranscript(@Query('studentNumber') studentNumber: string) {
      let transcript={}
      try {
          transcript=this.sisService.getCourseTranscripts(studentNumber);
      } catch (error) {
          throw new HttpException('Failed to retrieve student information', HttpStatus.INTERNAL_SERVER_ERROR);
      }
      return transcript;
  }

  @Get('pdf-transcript')
  @ApiOperation({ summary: 'Retrieve student transcript by student number' })
  @ApiQuery({ name: 'studentNumber', required: true, type: String, description: 'The student number' })
  @ApiResponse({ status: 200, description: 'The student transcript' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async getPdfTranscript(@Query('studentNumber') studentNumber: string, @Res() res: Response) {
      try {
          this.sisService.getPdfTranscript(studentNumber, res);
      } catch (error) {
          throw new HttpException('Failed to retrieve student information', HttpStatus.INTERNAL_SERVER_ERROR);
      }
      return res;
  }
}
