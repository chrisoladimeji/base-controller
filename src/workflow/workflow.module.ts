import { Module } from '@nestjs/common';
import { WorkflowController } from './workflow.controller';
import { WorkflowsModule } from './workflows/workflows.module'
import { InstancesModule } from './instances/instances.module'
import { WorkflowService } from './workflow.service';
import { AcaPyService } from 'src/services/acapy.service';
import { HttpModule } from '@nestjs/axios';
import { ExtendedAction } from './extensions/action.extension';
import { SisModule } from 'src/sis/sis.module';

@Module({
  imports: [
    WorkflowsModule,
    InstancesModule,
    HttpModule,
    SisModule
  ],
  controllers: [WorkflowController],
  providers: [WorkflowService, AcaPyService, ExtendedAction],
  exports: [WorkflowService]

})
export class WorkflowModule {}
