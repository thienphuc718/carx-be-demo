import { CityModel } from '../../../../models/Cities';

export interface ICityRepository {
  findAllByCondition(
    limit: number,
    offset: number,
    condition?: any,
    schema?: string,
  ): Promise<CityModel[]>;
  countByCondition(condition: any, schema: string): Promise<number>;
  findById(id: string): Promise<CityModel>;
  create(payload: any, schema: string): Promise<CityModel>;
  update(id: string, payload: any): Promise<any>;
  delete(id: string): void;
}

export const ICityRepository = Symbol('ICityRepository');
