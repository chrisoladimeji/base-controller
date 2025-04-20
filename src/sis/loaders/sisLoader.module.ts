import { Module } from '@nestjs/common';
import { SisLoaderService } from "./sisLoader.service";
import { TestLoaderService } from "./testLoader.service";
import { PdfLoaderService } from './pdfLoader.service';
import { RedisService } from '../../services/redis.service';
import { CsvLoaderService } from './csvLoader.service';
import { NhcsLoaderService } from './nhcsLoader.service';

const sisLoaderService = {
    //TODO Get service from env

    provide: SisLoaderService,
    //useClass: TestLoaderService
    // useClass: PdfLoaderService
    // useClass: CsvLoaderService
    useClass: NhcsLoaderService
};

@Module({
    providers: [
        sisLoaderService,
        RedisService,
        CsvLoaderService,
        PdfLoaderService,
    ],
    exports: [SisLoaderService]
})
export class SisLoaderModule {

}
