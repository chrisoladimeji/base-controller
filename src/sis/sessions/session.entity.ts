import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm'
import { Enrollment } from '../enrollments/enrollment.entity';
import { Course } from '../courses/course.entity';

@Entity()
export class Session {

    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @ManyToOne(() => Course, (course) => course.sessions)
    course: Course;

    @OneToMany(() => Enrollment, (enrollment) => enrollment.session)
    enrollments: Enrollment[];

    @Column({nullable: true})
    sessionId: string;

    @Column({nullable: true})
    termYear: number;

    @Column({nullable: true})
    termSeason: string;

    @Column({nullable: true})
    startDate: Date;

    @Column({nullable: true})
    endDate: Date;
}
