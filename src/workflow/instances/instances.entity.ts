import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { State_Data } from "./state_data.interface";

@Entity()
export class Instances {

    @PrimaryColumn("uuid")
    instance_id: number;

    @Column()
    workflow_id: string;

    @Column()
    client_id: string;

    @Column()
    current_state: string;

    @Column({ type: 'jsonb' })
    state_data: State_Data;

}