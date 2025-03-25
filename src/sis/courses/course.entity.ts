import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { Session } from "../sessions/session.entity";
import { School } from "../schools/school.entity";


@Entity()
export class Course {

    @PrimaryColumn()
    courseCode: string;

    @ManyToOne(() => School, (school) => school.courses)
    school: School;

    @OneToMany(() => Session, (session) => session.course)
    sessions: Session[];

    @Column({nullable: true})
    courseTitle: string;

    @Column({type: 'float', nullable: true})
    credits: number;

}