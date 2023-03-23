import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import * as Models from '../../models/';

const sequelizeModule = SequelizeModule.forRootAsync({
  useFactory: () => ({
    dialect: 'postgres',
    username: `postgres`,
    password: `thienphuc718`,
    database: `carx_be_demo`,
    host: `localhost`,
    port: 5432,
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
export class DatabaseModule { }
