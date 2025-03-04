import { Injectable } from '@nestjs/common';
const path = require('path');
const fs = require('fs');
import Student from './entities/si.entity';

@Injectable()
export class SisService {
  
  filePath = path.join(process.cwd(), './src/sis/student-transcript.json');
  rawData = fs.readFileSync(this.filePath, 'utf-8');
  studentData:Student[] = JSON.parse(this.rawData);
  
  getStudent(studentNumber){
    return this.studentData.find((student) => student.studentIdCred.studentNumber === studentNumber);
  }

  async getCumulativeTranscript(studentNumber: string) {
      const student = this.getStudent(studentNumber);
        return student? student.studentCumulativeTranscript :null ;
    }

    async getStudentDetails(studentNumber: string) {
      const student:Student = this.getStudent(studentNumber);
      return student;
    }
    
    async getCourseTranscripts(studentNumber: string) {
      const student:Student = this.getStudent(studentNumber);
      return student ? student.courseTranscript : null;
    }

}
