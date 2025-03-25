import { Module } from "@nestjs/common";
import { Session } from "./session.entity";
import { TypeOrmModule } from "@nestjs/typeorm";


@Module({
  imports: [TypeOrmModule.forFeature([Session])],
})
export class SessionsModule {}