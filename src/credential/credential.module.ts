import { Module } from '@nestjs/common';
import { CredentialController } from './credential.controller';
import { CredentialService } from './credential.service';
import { HttpModule } from '@nestjs/axios';
import { EventsGateway } from 'src/events/events.gateway';
import { MetadataModule } from '../metadata/metadata.module';
import { ConfigService } from '@nestjs/config';
import { ConnectionService } from '../connection/connection.service';
import { EllucianModule } from '../ellucian/ellucian.module';
import { AcaPyService } from '../services/acapy.service';
import { SisModule } from 'src/sis/sis.module';
import { WorkflowService } from 'src/workflow/workflow.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workflows } from 'src/workflow/workflows/workflows.entity';


@Module({
  imports: [HttpModule, MetadataModule, EllucianModule, SisModule, TypeOrmModule.forFeature([Workflows])],
  controllers: [CredentialController],
  providers: [
    CredentialService,
    ConfigService,
    EventsGateway,
    ConnectionService,
    AcaPyService,
    WorkflowService
  ],
})
export class CredentialModule {}
