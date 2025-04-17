import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Workflows } from './workflows.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class WorkflowsService {
    constructor(
        @InjectRepository(Workflows)
        private workflowsRepository: Repository<Workflows>,
    ) {}

    async save(workflows: Workflows[]) {
        await this.workflowsRepository.save(workflows);
    }  

    async getWorkflows(): Promise<Workflows[]> {
        return await this.workflowsRepository.find();
    }

    async getWorkflowByID(workflowID: string): Promise<Workflows> {
        return await this.workflowsRepository.findOneBy({workflow_id: workflowID});
    }
}
