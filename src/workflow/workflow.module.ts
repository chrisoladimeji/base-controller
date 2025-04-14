import { Module } from '@nestjs/common';
import { WorkflowController } from './workflow.controller';
import { WorkflowsModule } from './workflows/workflows.module'
import { InstancesModule } from './instances/instances.module'
import { WorkflowService } from './workflow.service';
import { WorkflowsService } from './workflows/workflows.service';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workflows } from './workflows/workflows.entity';
import { AcaPyService } from 'src/services/acapy.service';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports: [WorkflowsModule, InstancesModule, HttpModule, TypeOrmModule.forFeature([Workflows])],
  controllers: [WorkflowController],
  providers: [WorkflowService, WorkflowsService, AcaPyService],
  exports: [WorkflowService]

})
export class WorkflowModule {}
