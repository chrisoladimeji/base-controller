import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Course } from "../courses/course.entity";


@Entity()
export class School {

    constructor(name: string) {
        this.name = name;
    }

    @PrimaryColumn()
    name: string;

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