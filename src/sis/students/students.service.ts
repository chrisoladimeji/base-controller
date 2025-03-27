
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './student.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
  ) {}

  async save(students: Student[]) {
    await this.studentsRepository.save(students);
  }

  async getStudent(studentId: string): Promise<Student | null> {
    let result = await this.studentsRepository.findOneBy({id: studentId});
    return result;
  }
}
