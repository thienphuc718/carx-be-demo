import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import * as Models from '../../models/';

const sequelizeModule = SequelizeModule.forRootAsync({
  useFactory: () => ({
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    models: Object.values(Models),
    // synchronize: true,
    // autoLoadModels: true,
    logging: (sql: string) => console.log(sql),
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
  }),
});

@Module({
  imports: [sequelizeModule],
})
export class DatabaseModule {}
