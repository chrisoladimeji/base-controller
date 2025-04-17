import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Instances } from "./instances.entity";


@Module({
  imports: [TypeOrmModule.forFeature([Instances])],
})
export class InstancesModule {}