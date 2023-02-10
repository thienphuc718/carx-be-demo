import { IUserCompanyRelationsRepository } from './UserCompanyRelationsRepositoryInterface';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserCompanyRelationsModel } from '../../../../models/UserCompanyRelations';

@Injectable()
export class UserCompanyRelationsRepositoryImplementation
  implements IUserCompanyRelationsRepository
{
  constructor(
    @InjectModel(UserCompanyRelationsModel)
    private userCompanyRelationsModel: typeof UserCompanyRelationsModel,
  ) {}

  create(payload: any): Promise<UserCompanyRelationsModel> {
    return this.userCompanyRelationsModel.create(payload);
  }

  bulkCreate(payload: Array<any>): Promise<UserCompanyRelationsModel[]> {
    return this.userCompanyRelationsModel.bulkCreate(payload);
  }

  bulkUpdate(
    condition: Array<string | number>,
    payload: any,
  ): Promise<[nRowsModified: number]> {
    return this.userCompanyRelationsModel.update(payload, {
      where: {
        ...condition,
      },
    });
  }

  findOneByCondition(condition: any): Promise<UserCompanyRelationsModel> {
    return this.userCompanyRelationsModel.findOne({
      where: {
        ...condition
      }
    })
  }
}
