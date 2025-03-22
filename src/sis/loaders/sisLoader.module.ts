import { Module } from '@nestjs/common';
import { SisLoaderService } from "./sisLoader.service";
import { TestLoaderService } from "./testLoader.service";
import { StudentsModule } from '../students/students.module';

const sisLoaderService = {
    provide: SisLoaderService,
    useClass: TestLoaderService //TODO Get service from env  
};


@Module({
    imports: [StudentsModule],
    providers: [
        sisLoaderService
    ],
    exports: [SisLoaderService]
})
export class SisLoaderModule {}

