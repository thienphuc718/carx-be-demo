import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CompanyModel } from '../../../models';
import { CompanyController } from '../controller/CompanyController';
import { CompanyCategoryController } from '../controller/CompanyCategoryController';
import { CompanyRepositoryImplementation } from '../repository/CompanyRepositoryImplement';
import { ICompanyRepository } from '../repository/CompanyRepositoryInterface';
import { CompanyServiceImplementation } from '../service/CompanyServiceImplement';
import { ICompanyService } from '../service/CompanyServiceInterface';

@Module({
  imports: [SequelizeModule.forFeature([CompanyModel])],
  providers: [
    {
      provide: ICompanyRepository,
      useClass: CompanyRepositoryImplementation,
    },
    {
      provide: ICompanyService,
      useClass: CompanyServiceImplementation,
    },
  ],
  controllers: [CompanyController, CompanyCategoryController],
})
export class CompanyModule {}
