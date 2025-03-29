import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Course } from '../courses/course.entity';

@Entity()
export class Session {

    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    @ManyToOne(() => Course, (course) => course.code)
    course: string;

    @Column()
    termYear: number;

    @Column()
    termSeason: string;

    @Column()
    startDate: Date;

    @Column()
    endDate: Date;
}
