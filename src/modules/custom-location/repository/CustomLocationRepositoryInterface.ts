import { CustomLocationModel } from '../../../models';

export interface ICustomLocationRepository {
  findAllByCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<CustomLocationModel[]>;
  findById(id: string): Promise<CustomLocationModel>;
  create(payload: any): Promise<CustomLocationModel>;
  update(id: string, payload: any): Promise<[number, CustomLocationModel[]]>;
  count(condition: any): Promise<number>;
  delete(id: string): Promise<number>;
  findOneByCondition(condition: any): Promise<CustomLocationModel>
  findAllByConditionWithoutPagination(condition: any): Promise<CustomLocationModel[]>
  rawQuery(query: string): any
}

export const ICustomLocationRepository = Symbol('ICustomLocationRepository');
