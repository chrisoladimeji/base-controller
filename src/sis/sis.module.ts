import { Module } from '@nestjs/common';
import { SisService } from './sis.service';
import { SisController } from './sis.controller';
import { StudentsModule } from './students/students.module';
import { SisLoaderModule } from './loaders/sisLoader.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { SchoolsModule } from './schools/schools.module';
import { CoursesModule } from './courses/courses.module';
import { SessionsModule } from './sessions/sessions.module';

@Module({
  imports: [
    CoursesModule,
    EnrollmentsModule,
    SchoolsModule,
    SessionsModule,
    StudentsModule,
    SisLoaderModule
  ],
  providers: [
    SisService,
  ],
  controllers: [SisController],
  exports: [SisService]
})
export class SisModule {}
