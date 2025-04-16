import { DataSource } from 'typeorm';
import { Workflows } from './workflows.entity';

export const workflowsProviders = [
  {
    provide: 'WORKFLOWS_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Workflows),
    inject: ['DATA_SOURCE'],
  },
];