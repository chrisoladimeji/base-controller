import { DynamicModule, Module, Provider, Type } from '@nestjs/common';
import { SisLoaderService } from './sisLoader.service';
import { TestLoaderService } from './testLoader.service';
import { PdfLoaderService } from '../data-extract/pdfLoader.service';
import { RedisService } from '../../services/redis.service';
import { CsvLoaderService } from '../data-extract/csvLoader.service';
import { NhcsLoaderService } from './nhcsLoader.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EllucianService } from 'src/ellucian/ellucian.service';
import { EllucianModule } from 'src/ellucian/ellucian.module';
import { HttpModule } from '@nestjs/axios';
import { PenderLoaderService } from './penderLoader.service';

@Module({})
export class SisLoaderModule {
    static registerAsync(): DynamicModule {
        return {
            module: SisLoaderModule,
            imports: [
                ConfigModule,
                EllucianModule,
                HttpModule,
            ],
            providers: [
                RedisService,
                CsvLoaderService,
                PdfLoaderService,
                PenderLoaderService,
                TestLoaderService,
                NhcsLoaderService,
                EllucianService,
                {
                    provide: SisLoaderService,
                    inject: [
                        ConfigService,
                        TestLoaderService,
                        NhcsLoaderService,
                        PenderLoaderService,
                        EllucianService,
                    ],
                    useFactory: (
                        configService: ConfigService,
                        test: TestLoaderService,
                        nhcs: NhcsLoaderService,
                        pender: PenderLoaderService,
                        ellucian: EllucianService,
                    ): SisLoaderService => {
                        const type = configService.get<string>('LOAD_TYPE')?.toUpperCase();
                        switch (type) {
                            case 'TEST':
                                return test;
                            case 'NHCS':
                                return nhcs;
                            case 'PENDER':
                                return pender;
                            case 'CFCC':
                                return ellucian;
                            default:
                                throw new Error(`Unknown LOAD_TYPE: ${type}`);
                        }
                    },
                }
            ],
            exports: [SisLoaderService],
        };
    }
}
