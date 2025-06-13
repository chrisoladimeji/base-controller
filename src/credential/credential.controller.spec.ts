import { Test, TestingModule } from '@nestjs/testing';
import { CredentialController } from './credential.controller';
import { CredentialService } from './credential.service';
import { ConfigService } from '@nestjs/config';
import { EventsGateway } from '../events/events.gateway';
import { MetadataService } from '../metadata/metadata.service';
import { ConnectionService } from '../connection/connection.service';

describe('CredentialController', () => {
  let controller: CredentialController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CredentialController],
      providers: [
        { provide: CredentialService, useValue: { issueCredential: jest.fn() } },
        { provide: ConfigService, useValue: { get: jest.fn() } },
        { provide: EventsGateway, useValue: { sendMessage: jest.fn() } },
        { provide: MetadataService, useValue: { getByConnectionId: jest.fn() } },
        { provide: ConnectionService, useValue: { findOne: jest.fn() } },
      ],
    }).compile();

    controller = module.get<CredentialController>(CredentialController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});