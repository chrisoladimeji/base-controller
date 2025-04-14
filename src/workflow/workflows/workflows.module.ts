import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Workflows } from "./workflows.entity";
import { WorkflowsService } from "./workflows.service";
import { workflowsProviders } from "./workflows.providers";
import { DatabaseModule } from "src/database/database.module";

@Module({
  imports: [TypeOrmModule.forFeature([Workflows])],
  providers: [WorkflowsService],
  exports: [WorkflowsService]
})
export class WorkflowsModule {}