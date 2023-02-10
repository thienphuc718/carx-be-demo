import { Global, Module, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Sequelize } from 'sequelize-typescript';
import { getSchemaFromRequestHeader } from '../../helpers/jwtHelper';
import * as Models from '../../models';

const databaseConnectionFactory = {
  provide: 'DB_CONNECTION',
  scope: Scope.REQUEST,
  useFactory: async (request) => {
    // const schema = getSchemaFromRequestHeader(request);
    const schema = request.body.schema;
    // console.log(
    //   '🚀 ~ file: TenancyModule.ts ~ line 13 ~ useFactory: ~ schema',
    //   schema,
    // );
    const sequelize = new Sequelize({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      define: {
        schema,
      },
    });
    sequelize.addModels(Object.values(Models));
    return sequelize;
  },
  inject: [REQUEST],
};

@Global()
@Module({
  providers: [databaseConnectionFactory],
  exports: ['DB_CONNECTION'],
})
export class TenancyModule {}
