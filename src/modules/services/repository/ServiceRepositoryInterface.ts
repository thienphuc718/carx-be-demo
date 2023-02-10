import { ServiceCategoryRelationModel } from '../../../models/ServiceCategoryRelations';
import { ServiceModel } from '../../../models/Services';
import {
  CreateServiceCategoryRelationEntityDto,
  CreateServiceEntityDto,
  UpdateServiceEntityDto,
} from '../dto/ServiceDto';

export interface IServiceRepository {
  findAll(): Promise<ServiceModel[]>;
  findAllByCondition(
    limit: number | undefined,
    offset: number | undefined,
    condition: any,
    order_by?: any,
    order_type?: any,
  ): Promise<ServiceModel[]>;
  countByCondition(condition: any): Promise<number>;
  findOneByCondition(condition: any): Promise<ServiceModel>;
  findById(id: string): Promise<ServiceModel>;
  create(
    payload: any,
    transaction: any,
  ): Promise<ServiceModel>;
  update(id: string, payload: UpdateServiceEntityDto): Promise<[number]>;
  delete(id: string, transaction?: any): void;

  bulkCreateServiceCategories(
    payload: CreateServiceCategoryRelationEntityDto[],
    transaction: any,
  ): Promise<ServiceCategoryRelationModel[]>;

  findServiceCategoryRelationsByCondition(
    condition: any,
  ): Promise<ServiceCategoryRelationModel[]>;

  addServiceToCategory(payload: any): Promise<ServiceModel>;
  updateServiceCategoryRelationByCondition(
    payload: any,
    condition: any,
    transaction?: any,
  ): void;
  findAllByConditionRandomlyOrdered(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<ServiceModel[]>;
  findAllByConditionWithoutPagination(condition: any): Promise<ServiceModel[]>
  updateByCondition(condition: any, payload: any);
}

export const IServiceRepository = Symbol('IServiceRepository');
