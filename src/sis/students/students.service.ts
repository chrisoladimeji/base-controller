
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

  findAll(): Promise<Student[]> {
    return this.studentsRepository.find();
  }

  findOne(studentIdNumber: string): Promise<Student | null> {
    return this.studentsRepository.findOneBy({ studentIdNumber });
  }

  async insert(students: Student[]) {
    await this.studentsRepository.insert(students);
  }

  async remove(id: number): Promise<void> {
    await this.studentsRepository.delete(id);
  }
}
