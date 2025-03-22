import { Injectable, OnModuleInit } from '@nestjs/common';
const fs = require('fs');
const PDFDocument = require('pdfkit');
import { Student } from './students/student.entity';
import { StudentsService } from './students/students.service';
import { SisLoaderService } from './loaders/sisLoader.service';

@Injectable()
export class SisService implements OnModuleInit {
  
 
  constructor(
    private studentsService: StudentsService,
    private loaderService: SisLoaderService
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

  async getStudentDetails(studentNumber: string) {
    const student:Student = this.getStudent(studentNumber);
    return null; //return student;
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
