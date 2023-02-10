import { TransactionModel } from '../../../models/Transactions';
import {
  CreateTransactionPayloadDto,
  FilterTransactionDto,
  UpdateTransactionPayloadDto,
} from '../dto/TransactionDto';

export interface ITransactionService {
  getTransactionDetailByCondition(condition: any): Promise<TransactionModel>;
  getTransactionList(
    filterPayloadDto: FilterTransactionDto,
  ): Promise<TransactionModel[]>;
  createTransaction(
    payload: CreateTransactionPayloadDto,
  ): Promise<TransactionModel>;
  updateTransactionByCondition(
    condition: any,
    payload: UpdateTransactionPayloadDto,
  ): Promise<TransactionModel>;
}

export const ITransactionService = Symbol('ITransactionService');
