import { ProductCategoryModel } from '../../../../models/ProductCategories';
import {
  CreateProductCategoryDto,
  UpdateProductCategoryDto,
} from '../../dto/ProductCategoryDto';

export interface IProductCategoryRepository {
  findAllByCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<ProductCategoryModel[]>;

  findAllByConditionWithoutPaginate(
    condition: any,
  ): Promise<ProductCategoryModel[]>;

  findOneById(id: string): Promise<ProductCategoryModel>;

  countByCondition(condition: any): Promise<number>;

  findProductOfCategory(
    categoryId: string,
    limit: number,
    offset: number,
    productOptions,
    priceOptions,
    orderOptions,
  ): Promise<any>;

  countProductOfcategory(
    categoryId: string,
    productOptions,
    priceOptions,
  ): Promise<number>;

  create(payload: CreateProductCategoryDto): Promise<ProductCategoryModel>;

  updateById(
    id: string,
    payload: UpdateProductCategoryDto,
  ): Promise<[number, ProductCategoryModel[]]>;

  create(payload: CreateProductCategoryDto): Promise<ProductCategoryModel>;
  delete(ids: string[]): Promise<[number, ProductCategoryModel[]]>;
}

export const IProductCategoryRepository = Symbol('IProductCategoryRepository');
