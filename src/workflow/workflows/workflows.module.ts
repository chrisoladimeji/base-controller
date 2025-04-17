import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Workflows } from "./workflows.entity";
import { WorkflowsService } from "./workflows.service";

@Module({
  imports: [TypeOrmModule.forFeature([Workflows])],
  providers: [WorkflowsService],
  exports: [WorkflowsService]
})
export class WorkflowsModule {}