import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Student{

  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  fullName: string;

  @Column()
  studentIdNumber: string;

  @Column({
    nullable: true
  })
  transcript: string;

}