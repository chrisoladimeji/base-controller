import { Injectable, Inject } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
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

    async createWorkflow(workflow: Workflows): Promise<Workflows> {
        return await this.workflowsRepository.save(workflow);
    }

    async updateWorkflow(workflow: Workflows): Promise<UpdateResult> {
        return await this.workflowsRepository.update(workflow.workflow_id, workflow);
    }
}
