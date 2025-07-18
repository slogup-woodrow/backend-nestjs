import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import envFilePath from 'envs/env';
import * as path from 'path';

config({ path: envFilePath });

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  schema: process.env.DB_SCHEMA,
  logging: false,
  synchronize: false,
  // entities: [__dirname + '/../../**/*.entity.{js,ts}'],
  entities: [
    path.resolve(
      __dirname,
      '../../../domain/static-board/entities/*.entity.{js,ts}',
    ),
  ],
  migrations: [path.join(__dirname, '../migrations/*.ts')],
  migrationsTableName: 'migrations',
};

export const datasource = new DataSource(dataSourceOptions);
