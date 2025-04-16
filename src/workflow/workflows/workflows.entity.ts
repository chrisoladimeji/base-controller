import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Render } from "./render.interface";
import { State } from "./state.interface";

@Entity()
export class Workflows {

    @PrimaryColumn()
    workflow_id: string;

    @Column()
    name: string;

    @Column()
    initial_state: string;

    @Column('jsonb', { array: true, nullable: true})
    render: Render;

    @Column('jsonb', { array: false, nullable: true})
    states: State;
}