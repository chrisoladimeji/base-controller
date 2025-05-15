// src/hello/hello.module.ts
import { Module } from '@nestjs/common';
import { HelloService } from './hello.service';
import { HelloController } from './hello.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { SisModule } from '../sis/sis.module';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    SisModule 
  ],
  controllers: [HelloController],
  providers: [HelloService],
})
export class HelloModule {}