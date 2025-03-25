import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm'
import { Enrollment } from '../enrollments/enrollment.entity';

@Entity()
export class Student{

  @PrimaryColumn()
  id: string;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.student)
  enrollments: Enrollment[];

  @Column()
  fullName: string;

  @Column({nullable: true})
  address: string;

  @Column({nullable: true})
  ssn: number;

  @Column({nullable: true})
  birthDate: Date;

  @Column({nullable: true})
  phone: string;

  @Column({nullable: true})
  contactName: string;

  @Column({nullable: true})
  contactPhone: string;

  @Column({nullable:true})
  graduationDate: string;

  @Column({nullable: true})
  program: string;

  @Column({type: 'float', nullable: true})
  gpa: number;

  @Column({type: 'float', nullable: true})
  creditsEarned: number;

  @Column({nullable: true})
  transcript: string;

  @Column('jsonb', {nullable: true})
  otherFields: object;

}
