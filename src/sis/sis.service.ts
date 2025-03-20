import { Injectable } from '@nestjs/common';
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');
import { Student } from './students/student.entity';

@Injectable()
export class SisService {
  
  filePath = path.join(process.cwd(), './src/sis/student-transcript.json');
  rawData = fs.readFileSync(this.filePath, 'utf-8');
  studentData: Student[] = JSON.parse(this.rawData);
  
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
    console.log('getting transcript...')

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
