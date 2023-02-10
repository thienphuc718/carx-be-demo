import { UserCompanyRelationsModel } from '../../../../models/UserCompanyRelations';

export interface IUserCompanyRelationsRepository {
  create(payload: any): Promise<UserCompanyRelationsModel>;
  bulkCreate(payload: Array<any>): Promise<UserCompanyRelationsModel[]>;
  bulkUpdate(
    condition: Array<string | number>,
    payload: any,
  ): Promise<[nRowsModified: number]>;
  findOneByCondition(condition: any): Promise<UserCompanyRelationsModel>;
}

export const IUserCompanyRelationsRepository = Symbol(
  'IUserCompanyRelationsRepository',
);
