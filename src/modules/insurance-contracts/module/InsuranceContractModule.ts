import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { InsuranceContractModel } from '../../../models';
import { InsuranceContractRepositoryInterface } from '../repository/InsuranceContractRepositoryInterface';
import { InsuranceContractRepositoryImplementation } from '../repository/InsuranceContractRepositoryImplementation';
import { InsuranceContractServiceImplementation } from '../service/InsuranceContractServiceImplementation';
import {InsuranceContractServiceInterface} from "../service/InsuranceContractServiceInterface";

@Module({
  imports: [SequelizeModule.forFeature([InsuranceContractModel])],
  providers: [
    {
      provide: InsuranceContractRepositoryInterface,
      useClass: InsuranceContractRepositoryImplementation,
    },
    {
      provide: InsuranceContractServiceInterface,
      useClass: InsuranceContractServiceImplementation,
    },
  ],
  exports: [InsuranceContractServiceInterface],
})
export class InsuranceContractModule {}