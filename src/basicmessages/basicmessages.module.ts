import { Module } from '@nestjs/common';
import { BasicMessagesController } from './basicmessages.controller';
import { BasicMessagesService } from './basicmessages.service';
import { WorkflowModule } from '../workflow/workflow.module';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { RedisService } from '../services/redis.service';
import { EllucianController } from 'src/ellucian/ellucian.controller';
import { AcaPyService } from '../services/acapy.service';
import { SisService } from 'src/sis/sis.service';

@Module({
  imports: [WorkflowModule, ConfigModule, HttpModule],
  controllers: [BasicMessagesController],
  providers: [
    BasicMessagesService,
    RedisService,
    AcaPyService,
    SisService
  ],
})
export class BasicMessagesModule {}
