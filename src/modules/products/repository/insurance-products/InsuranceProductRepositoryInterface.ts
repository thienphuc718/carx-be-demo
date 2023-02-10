import { InsuranceProductModel } from '../../../../models/InsuranceProducts';

export interface InsuranceProductRepositoryInterface {
  findAllByCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<InsuranceProductModel[]>;
  findById(id: string): Promise<InsuranceProductModel>;
  create(payload: any): Promise<InsuranceProductModel>;
  updateById(id: string, payload: any): Promise<[number, InsuranceProductModel[]]>;
  deleteById(id: string): Promise<number>;
  findAllByConditionWithoutPagination(condition: any): Promise<InsuranceProductModel[]>;
  findOneByCondition(condition: any): Promise<InsuranceProductModel>;
}

export const InsuranceProductRepositoryInterface = Symbol(
  'InsuranceProductRepositoryInterface',
);