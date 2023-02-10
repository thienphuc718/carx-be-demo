import { InjectModel } from '@nestjs/sequelize';
import { TransactionModel } from '../../../models/Transactions';
import { ITransactionRepository } from './TransactionRepositoryInterface';

export class TransactionRepositoryImplementation
  implements ITransactionRepository
{
  constructor(
    @InjectModel(TransactionModel) private transactionModel: typeof TransactionModel,
  ) {}
  findAllByConditionWithoutPagination(
    condition: any,
  ): Promise<TransactionModel[]> {
    return this.transactionModel.findAll({
      where: {
        ...condition,
      },
    });
  }
  findAllByCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<TransactionModel[]> {
    return this.transactionModel.findAll({
      limit: limit,
      offset: offset,
      where: {
        ...condition,
      },
      order: [['updated_at', 'desc']],
    });
  }
  create(payload: any): Promise<TransactionModel> {
    return this.transactionModel.create(payload);
  }
  findById(id: string): Promise<TransactionModel> {
    return this.transactionModel.findByPk(id);
  }
  findOneByCondition(condition: any): Promise<TransactionModel> {
    return this.transactionModel.findOne({
      where: {
        ...condition,
      },
    });
  }
  updateById(id: string, payload: any): Promise<[number, TransactionModel[]]> {
    return this.transactionModel.update(payload, {
      where: {
        id: id,
      },
      returning: true,
    });
  }
  updateByCondition(
    condition: any,
    payload: any,
  ): Promise<[number, TransactionModel[]]> {
    return this.transactionModel.update(payload, {
      where: {
        ...condition,
      },
      returning: true,
    });
  }
}
