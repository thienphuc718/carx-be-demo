import { Inject } from '@nestjs/common';
import { TransactionModel } from '../../../models/Transactions';
import {
  FilterTransactionDto,
  CreateTransactionPayloadDto,
  UpdateTransactionPayloadDto,
} from '../dto/TransactionDto';
import { ITransactionRepository } from '../repository/TransactionRepositoryInterface';
import { ITransactionService } from './TransactionServiceInterface';

export class TransactionServiceImplementation implements ITransactionService {
  constructor(
    @Inject(ITransactionRepository)
    private transactionRepository: ITransactionRepository,
  ) {}
  getTransactionDetailByCondition(condition: any): Promise<TransactionModel> {
    return this.transactionRepository.findOneByCondition(condition);
  }
  getTransactionList(
    filterPayloadDto: FilterTransactionDto,
  ): Promise<TransactionModel[]> {
    try {
      const { limit, page, ...rest } = filterPayloadDto;
      return this.transactionRepository.findAllByCondition(
        limit,
        (page - 1) * limit,
        rest,
      );
    } catch (error) {
      throw error;
    }
  }
  createTransaction(
    payload: CreateTransactionPayloadDto,
  ): Promise<TransactionModel> {
    return this.transactionRepository.create(payload);
  }
  async updateTransactionByCondition(
    condition: any,
    payload: UpdateTransactionPayloadDto,
  ): Promise<TransactionModel> {
    try {
      const transaction = await this.getTransactionDetailByCondition(condition);
      if (!transaction) {
        throw new Error('Transaction not found');
      }
      const [nModified, transactions] =
        await this.transactionRepository.updateByCondition(condition, payload);
      if (!nModified) {
        throw new Error('Cannot update transaction');
      }
      const updatedTransaction = transactions[0];
      return updatedTransaction;
    } catch (error) {
      throw error;
    }
  }
  getTransactionDetail(id: string): Promise<TransactionModel> {
    return this.transactionRepository.findById(id);
  }
}
