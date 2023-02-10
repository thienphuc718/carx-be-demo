import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { UserCompanyRelationsModel } from './../../../models/UserCompanyRelations';
import { UserModel } from '../../../models';
import { CompanyModel } from '../../../models';
import { UserController } from '../controller/UserController';
import { UserRepositoryImplementation } from '../repository/user/UserRepositoryImplement';
import { IUserRepository } from '../repository/user/UserRepositoryInterface';
import { UserServiceImplementation } from '../service/UserServiceImplement';
import { ICompanyRepository } from '../../companies/repository/CompanyRepositoryInterface';
import { CompanyRepositoryImplementation } from '../../companies/repository/CompanyRepositoryImplement';
import { IUserService } from '../service/UserServiceInterface';
import { IUserCompanyRelationsRepository } from '../repository/user-company-relations/UserCompanyRelationsRepositoryInterface';
import { UserCompanyRelationsRepositoryImplementation } from '../repository/user-company-relations/UserCompanyRelationsRepositoryImplement';
import { AgentModule } from '../../agents/module/AgentModule';
import { CustomerModule } from '../../customers/module/Customer';
import { CarModule } from '../../cars/module/CarModule';
import { ForbiddenKeywordModule } from '../../forbidden-keywords/module/ForbiddenKeywordModule';

@Module({
  imports: [
    SequelizeModule.forFeature([
      UserModel,
      CompanyModel,
      UserCompanyRelationsModel,
    ]),
    AgentModule,
    CustomerModule,
    CarModule,
    ForbiddenKeywordModule,
  ],
  providers: [
    {
      provide: IUserRepository,
      useClass: UserRepositoryImplementation,
    },
    {
      provide: IUserCompanyRelationsRepository,
      useClass: UserCompanyRelationsRepositoryImplementation,
    },
    {
      provide: ICompanyRepository,
      useClass: CompanyRepositoryImplementation,
    },
    {
      provide: IUserService,
      useClass: UserServiceImplementation,
    },
  ],
  controllers: [UserController],
  exports: [IUserService],
})
export class UserModule {}
