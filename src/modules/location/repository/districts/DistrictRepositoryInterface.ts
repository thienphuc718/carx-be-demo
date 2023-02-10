import { DistrictModel } from '../../../../models/Districts';

export interface IDistrictRepository {
  findAllByCondition(
    limit: number,
    offset: number,
    condition?: any,
    schema?: string,
  ): Promise<DistrictModel[]>;
  countByCondition(condition: any, schema: string): Promise<number>;
  findById(id: string): Promise<DistrictModel>;
  create(payload: any, schema: string): Promise<DistrictModel>;
  update(id: string, payload: any): Promise<any>;
  delete(id: string): void;
}

export const IDistrictRepository = Symbol('IDistrictRepository');
