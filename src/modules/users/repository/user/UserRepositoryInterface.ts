import { UserModel } from '../../../../models/Users';

export interface IUserRepository {
  findAll(schema: string): Promise<UserModel[]>;
  findAllByCondition(
    limit: number,
    offset: number,
    condition: any,
    schema: string,
  ): Promise<UserModel[]>;
  findAllByConditionWithoutPagination(condition: any, schema: string): Promise<UserModel[]>;
  findOneByCondition(condition: any, schema: string): Promise<UserModel>;
  countByCondition(condition: any, schema: string): Promise<number>;
  findById(id: string, schema: string): Promise<UserModel>;
  create(
    payload: any,
    schema: string,
    callback?: (transaction: any, createdUser: UserModel) => Promise<void>,
  ): Promise<UserModel>;
  update(id: string, payload: any, schema: string): Promise<[number, UserModel[]]>;
  delete(id: string, schema: string): void;
}

export const IUserRepository = Symbol('IUserRepository');
