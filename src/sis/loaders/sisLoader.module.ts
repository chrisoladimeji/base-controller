import { Module } from '@nestjs/common';
import { SisLoaderService } from "./sisLoader.service";
import { TestLoaderService } from "./testLoader.service";
import { StudentsModule } from '../students/students.module';
import { EnrollmentsModule } from '../enrollments/enrollments.module';
import { SchoolsModule } from '../schools/schools.module';
import { SessionsModule } from '../sessions/sessions.module';
import { CoursesModule } from '../courses/courses.module';

const sisLoaderService = {
    provide: SisLoaderService,
    useClass: TestLoaderService //TODO Get service from env  
};


@Module({
    imports: [
        StudentsModule,
        EnrollmentsModule,
        SessionsModule,
        CoursesModule,
        SchoolsModule
    ],
    providers: [
        sisLoaderService
    ],
    exports: [SisLoaderService]
})
export class SisLoaderModule {}

