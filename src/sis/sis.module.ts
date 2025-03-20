import { Module } from '@nestjs/common';
import { SisService } from './sis.service';
import { SisController } from './sis.controller';
import { StudentsModule } from './students/students.module';

@Module({
  imports: [StudentsModule],
  providers: [SisService],
  controllers: [SisController],
  exports: [SisService]
})
export class SisModule {}
