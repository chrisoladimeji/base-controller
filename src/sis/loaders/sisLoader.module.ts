import { Module } from '@nestjs/common';
import { SisLoaderService } from "./sisLoader.service";
import { TestLoaderService } from "./testLoader.service";
import { PdfLoaderService } from './pdfLoader.service';

const sisLoaderService = {
    provide: SisLoaderService,
    useClass: TestLoaderService
    // useClass: PdfLoaderService //TODO Get service from env  
};

@Module({
    providers: [
        sisLoaderService
    ],
    exports: [SisLoaderService]
})
export class SisLoaderModule {

}
