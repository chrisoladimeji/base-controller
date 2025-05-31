import { Module } from '@nestjs/common';
import { WorkflowController } from './workflow.controller';
import { WorkflowsModule } from './workflows/workflows.module'
import { InstancesModule } from './instances/instances.module'
import { WorkflowService } from './workflow.service';
import { AcaPyService } from '../services/acapy.service';
import { HttpModule } from '@nestjs/axios';
import { ExtendedAction } from './extensions/action.extension';
import { SisModule } from '../sis/sis.module';
import { AiSkillsModule } from '../aiskills/aiskills.module';

@Module({
  imports: [
    WorkflowsModule,
    InstancesModule,
    HttpModule,
    SisModule,
    AiSkillsModule
  ],
  controllers: [WorkflowController],
  providers: [WorkflowService, AcaPyService, ExtendedAction],
  exports: [WorkflowService]

})
export class WorkflowModule {}
