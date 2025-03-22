import { Module } from '@nestjs/common';
import { SisService } from './sis.service';
import { SisController } from './sis.controller';
import { StudentsModule } from './students/students.module';
import { SisLoaderModule } from './loaders/sisLoader.module';

@Module({
  imports: [StudentsModule, SisLoaderModule],
  providers: [
    SisService,
  ],
  controllers: [SisController],
  exports: [SisService]
})
export class SisModule {}
