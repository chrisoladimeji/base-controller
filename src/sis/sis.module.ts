import { Module } from '@nestjs/common';
import { SisService } from './sis.service';
import { SisController } from './sis.controller';
import { SisLoaderModule } from './loaders/sisLoader.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    SisLoaderModule.registerAsync(),
  ],
  providers: [
    SisService,
  ],
  controllers: [SisController],
  exports: [SisService]
})
export class SisModule {}
