import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const configService = new ConfigService();
      const dataSource = new DataSource({
        type: 'postgres',
        host: configService.get<string>('WORKFLOW_DB_HOST', 'localhost'),
        port: configService.get<number>('WORKFLOW_DB_PORT', 5435),
        username: configService.get<string>('WORKFLOW_DB_USER', 'postgres'),
        password: configService.get<string>('WORKFLOW_DB_PASSWORD', 'password123'),
        database: configService.get<string>('WORKFLOW_DB_NAME', 'postgres'),
        entities: [
            __dirname + '/../**/*.entity{.ts,.js}',
        ],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];
