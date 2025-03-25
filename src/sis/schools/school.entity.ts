import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Course } from "../courses/course.entity";


@Entity()
export class School {

    @PrimaryColumn()
    name: string;

    @OneToMany(() => Course, (course) => course.school)
    courses: Course[];

    @Column()
    address: string;

    @Column()
    contactName: string;

    @Column()
    contactPhone: string;

    @Column()
    district: string;

    @Column()
    schoolId: string

    @Column()
    gradeLevels: string
}