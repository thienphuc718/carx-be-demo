import { ProductVariantModel } from '../../../../models/ProductVariants';

import {
  CreateProductVariantEntityDto,
  UpdateProductVariantPayloadDto,
} from '../../dto/ProductVariantDto';

export interface IProductVariantRepository {
  findAll(schema: string): Promise<ProductVariantModel[]>;

  findAllByCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<ProductVariantModel[]>;
  countByCondition(condition: any): Promise<number>;
  findById(id: string): Promise<ProductVariantModel>;

  findOneByCondition(condition: any): Promise<ProductVariantModel>;

  create(
    payload: any,
    callback: (transaction: any) => Promise<void>,
  ): Promise<ProductVariantModel>;

  update(
    id: string,
    payload: UpdateProductVariantPayloadDto,
    transaction?: any,
  ): Promise<[number, ProductVariantModel[]]>;

  delete(id: string): void;
  deleteByCondition(condition: any, transaction: any): Promise<any>;
  bulkCreate(
    payload: CreateProductVariantEntityDto[],
    transaction: any,
  ): Promise<ProductVariantModel[]>;
  findAllBySkus(skuList: string[]): Promise<ProductVariantModel[]>
}

export const IProductVariantRepository = Symbol('IProductVariantRepository');
