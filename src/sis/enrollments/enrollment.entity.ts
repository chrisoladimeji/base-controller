import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { Student } from '../students/student.entity';
import { Session } from '../sessions/session.entity';

@Entity()
export class Enrollment{
  
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ManyToOne(() => Student, (student) => student.enrollments)
  student: Student

  @ManyToOne(() => Session, (session) => session.enrollments)
  session: Session

  @Column({nullable: true})
  gradeLevel: string;

  @Column({type: 'float', nullable: true})
  creditEarned: number;

  @Column({nullable: true})
  grade: string;

  @Column({type: 'float', nullable: true})
  hoursAttempted: number

  @Column({type: 'float', nullable: true})
  hoursCompleted: number

  @Column({type: 'float', nullable: true})
  gradePointsEarned: number
}
