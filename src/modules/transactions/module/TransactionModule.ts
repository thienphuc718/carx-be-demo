import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TransactionModel } from '../../../models/Transactions';
import { ITransactionRepository } from '../repository/TransactionRepositoryInterface';
import { TransactionRepositoryImplementation } from '../repository/TransactionRepostioryImplementation';
import { ITransactionService } from '../service/TransactionServiceInterface';
import { TransactionServiceImplementation } from '../service/TranscationServiceImplementation';

@Module({
  imports: [SequelizeModule.forFeature([TransactionModel])],
  providers: [
    {
      provide: ITransactionRepository,
      useClass: TransactionRepositoryImplementation,
    },
    {
      provide: ITransactionService,
      useClass: TransactionServiceImplementation,
    },
  ],
  exports: [ITransactionService],
})
export class TransactionModule {}
