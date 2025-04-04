import { Injectable, OnModuleInit } from '@nestjs/common';
import { Student } from './students/student.entity';
import { StudentsService } from './students/students.service';
import { SisLoaderService } from './loaders/sisLoader.service';
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

  async getStudentId(studentNumber: string) {
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
      gradeLevel: null,
      graduationDate: student.graduationDate,
  
      // School ID fields
      schoolName: this.configService.get('SCHOOL'),
      schoolContact: null,
      schoolPhone: null,

      // Dave's additional fields
      expiration: null,
      barcodeType: null,
      barcode: null,
      qrCode: null,
    };

    return studentId;
  }
}
