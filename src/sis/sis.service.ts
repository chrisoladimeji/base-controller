import { Injectable, OnModuleInit } from '@nestjs/common';
const fs = require('fs');
const PDFDocument = require('pdfkit');
import { Student } from './students/student.entity';
import { StudentsService } from './students/students.service';
import { SisLoaderService } from './loaders/sisLoader.service';
import { StudentId } from '../models/studentId.model';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SisService implements OnModuleInit {
  
 
  constructor(
    private studentsService: StudentsService,
    private loaderService: SisLoaderService,
    private configService: ConfigService
  ) {};


  async onModuleInit() {
    this.loaderService.load();
  }

  getStudent(studentNumber){
    return null; //return this.studentData.find((student) => student.studentIdCred.studentNumber === studentNumber);
  }

  async getCumulativeTranscript(studentNumber: string) {
    const student = this.getStudent(studentNumber);
      return null; //return student? student.studentCumulativeTranscript :null ;
  }

  async getStudentId(studentNumber: string): Promise<StudentId> {
    console.log(`Getting student id: ${studentNumber}`);
    let student: Student = await this.studentsService.getStudent(studentNumber);
    if (student) console.log(`Student found: ${student.fullName}`);
    else console.log('Student not found');


    let studentId = {
      // Student ID fields
      studentNumber: student.id,
      studentFullName: student.fullName,
      studentBirthDate: student.birthDate ? student.birthDate.toString(): null,
  
      studentContactName: student.contactName,
      studentContactPhone: student.contactPhone,
  
      // Student registration fields
      program: student.program,
      graduationDate: student.graduationDate,
  
      // School ID fields
      schoolName: this.configService.get('SCHOOL'),
      schoolContact: null,
      schoolPhone: null,
    };

    return studentId;
  }
  
  async getCourseTranscripts(studentNumber: string) {
    const student:Student = this.getStudent(studentNumber);
    return null; //return student ? student.courseTranscript : null;
  }

  async getPdfTranscript(studentNumber: string, res) {
    const student: Student = null; // this.getStudent(studentNumber);

    const transcriptText = fs.readFileSync('./src/sis/sample_transcript.txt', 'utf8');
    const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
        font: 'Courier' // Monospace font
    });
    doc.pipe(res);
    doc.fontSize(10);
    doc.text(transcriptText, { lineGap: 2 });
    doc.end();

    return student ? res : null;
  }
}
