import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { School } from "./school.entity";


@Module({
  imports: [TypeOrmModule.forFeature([School])],
})
export class SchoolsModule {}