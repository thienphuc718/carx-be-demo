import { ServiceCategoryModel } from '../../../../models/ServiceCategories';

export interface IServiceCategoryRepository {
  findAll(): Promise<ServiceCategoryModel[]>;
  findAllByCondition(limit: number, offset: number, condition: any): Promise<ServiceCategoryModel[]>;
  findById(id: string): Promise<ServiceCategoryModel>;
  create(payload: any): Promise<ServiceCategoryModel>;
  update(id: string, payload: any): Promise<any>;
  delete(id: string): void;
  count(condition?: any): Promise<number>
  findOneByCondition(condition: any): Promise<ServiceCategoryModel>
}

export const IServiceCategoryRepository = Symbol('IServiceCategoryRepository');
