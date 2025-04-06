import { Controller, Get, HttpException, HttpStatus, Query, Res } from '@nestjs/common';
import { SisService } from './sis.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('SIS')
@Controller()
export class SisController {
  constructor(private readonly sisService: SisService) {}

  @Get('student-id')
  @ApiOperation({ summary: 'Retrieve student id information by student number' })
  @ApiQuery({ name: 'studentNumber', required: true, type: String, description: 'The student number' })
  @ApiResponse({ status: 200, description: 'The student name' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async getStudentId(@Query('studentNumber') studentNumber: string) {
      let studentId;
        try {
            studentId = await this.sisService.getStudentId(studentNumber);
        } catch (error) {
            throw new HttpException('Failed to retrieve student information', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    return studentId;
  }


  @Get('student-transcript')
  @ApiOperation({ summary: 'Retrieve student transcript by student number' })
  @ApiQuery({ name: 'studentNumber', required: true, type: String, description: 'The student number' })
  @ApiResponse({ status: 200, description: 'Student Transcript Found' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async getStudentTranscript(@Query('studentNumber') studentNumber: string) {
      let studentTranscript;
        try {
            studentTranscript = await this.sisService.getStudentTranscript(studentNumber);
        } catch (error) {
            throw new HttpException('Failed to retrieve student information', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    return studentTranscript;
  }
}
