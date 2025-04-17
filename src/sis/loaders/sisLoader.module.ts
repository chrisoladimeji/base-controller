import { Module } from '@nestjs/common';
import { SisLoaderService } from "./sisLoader.service";
import { TestLoaderService } from "./testLoader.service";
import { PdfLoaderService } from './pdfLoader.service';
import { RedisService } from '../../services/redis.service';
import { CsvLoaderService } from './csvLoader.service';

const sisLoaderService = {
    provide: SisLoaderService,
    // useClass: TestLoaderService
    // useClass: PdfLoaderService //TODO Get service from env
    useClass: CsvLoaderService  
};

@Module({
    providers: [
        sisLoaderService,
        RedisService
    ],
    exports: [SisLoaderService]
})
export class SisLoaderModule {

}
