import { TransactionModel } from '../../../models/Transactions';

export interface ITransactionRepository {
  findAllByCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<TransactionModel[]>;
  findAllByConditionWithoutPagination(condition: any): Promise<TransactionModel[]>;
  create(payload: any): Promise<TransactionModel>;
  findById(id: string): Promise<TransactionModel>;
  findOneByCondition(condition: any): Promise<TransactionModel>;
  updateById(id: string, payload: any): Promise<[number, TransactionModel[]]>;
  updateByCondition(
    condition: any,
    payload: any,
  ): Promise<[number, TransactionModel[]]>;
}

export const ITransactionRepository = Symbol('ITransactionRepository');
