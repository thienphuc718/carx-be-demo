import { SequelizeModule } from '@nestjs/sequelize';
import { Module } from '@nestjs/common';

import { CustomerClubServiceImplementation } from '../service/customer-club/CustomerClubServiceImplement';
import { CustomerClubRepositoryImplementation } from '../repository/customer-club/CustomerClubRepositoryImplement';
import { ICustomerClubRepository } from '../repository/customer-club/CustomerClubRepositoryInterface';
import { CustomerClubModel } from '../../../models/CustomerClubs';
import { ICustomerClubService } from '../service/customer-club/CustomerClubServiceInterface';
import { CustomerClubController } from '../controller/CustomerClubController';

@Module({
  imports: [SequelizeModule.forFeature([CustomerClubModel])],
  providers: [
    {
      provide: ICustomerClubRepository,
      useClass: CustomerClubRepositoryImplementation,
    },
    {
      provide: ICustomerClubService,
      useClass: CustomerClubServiceImplementation,
    },
  ],
  controllers: [CustomerClubController],
  exports: [ICustomerClubService],
})
export class CustomerClubModule {}
