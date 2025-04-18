import { Controller, Get, HttpException, HttpStatus, Post, Query, Res } from '@nestjs/common';
import { SisService } from './sis.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StudentIdDto } from 'src/dtos/studentId.dto';
import { TranscriptDto } from 'src/dtos/transcript.dto';


@ApiTags('SIS')
@Controller()
export class SisController {
  constructor(private readonly sisService: SisService) {}

  @Get('load')
  @ApiOperation({summary: 'Batch load the SIS data to initialize credential transfer'})
  @ApiResponse({ status: 200, description: 'The student name' })
  async load(): Promise<void> {
    try {
      this.sisService.load();
    }
    catch (error) {
      console.log(error);
      throw new HttpException('Failed to load SIS information', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('student-id')
  @ApiOperation({ summary: 'Retrieve student id information by student number' })
  @ApiQuery({ name: 'studentNumber', required: true, type: String, description: 'The student number' })
  @ApiResponse({ status: 200, description: 'The student name' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async getStudentId(@Query('studentNumber') studentNumber: string): Promise<any> {
    let studentId;
      try {
          studentId = await this.sisService.getStudentId(studentNumber);
      } catch (error) {
          throw new HttpException('Failed to retrieve student information', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    return {studentIdCred: studentId};
  }

  @Post('student-photo')
  @ApiOperation({summary: 'Retrieve student photo by student number'})
  @ApiQuery({ name: 'studentNumber', required: true, type: String, description: 'The student number'})
  async getStudentPhoto(@Query('studentNumber') studentNumber: string) {
    return null
  }


  @Get('student-transcript')
  @ApiOperation({ summary: 'Retrieve student transcript by student number' })
  @ApiQuery({ name: 'studentNumber', required: true, type: String, description: 'The student number' })
  @ApiResponse({ status: 200, description: 'Student Transcript Found' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async getStudentTranscript(@Query('studentNumber') studentNumber: string): Promise<TranscriptDto> {
  let studentTranscript;
    try {
        studentTranscript = await this.sisService.getStudentTranscript(studentNumber);
    } catch (error) {
        throw new HttpException('Failed to retrieve student information', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return studentTranscript;
  }
}
