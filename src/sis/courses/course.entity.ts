import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { School } from "../schools/school.entity";


@Entity()
export class Course {

    @PrimaryColumn()
    code: string;

    @ManyToOne(() => School, (school) => school.name)
    @Column()
    school: string;

    @Column()
    title: string;

    @Column({type: 'float'})
    credits: number;

}