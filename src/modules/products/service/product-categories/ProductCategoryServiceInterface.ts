import { ProductCategoryModel } from '../../../../models/ProductCategories';
import { ProductModel } from '../../../../models/Products';
import { PaginationDto } from '../../dto';
import {
  CreateProductCategoryDto,
  QueryProductByCategoryDto,
  UpdateProductCategoryDto,
} from '../../dto/ProductCategoryDto';

export interface IProductCategoryService {
  getProductCategoryByCondition(
    pagination: PaginationDto,
    condition: any,
  ): Promise<ProductCategoryModel[]>;

  countProductCategoryByCondition(condition: any): Promise<number>;

  getProductCategoryChildren(id: string): Promise<ProductCategoryModel[]>;

  getProductByCategoryId(
    categoryId: string,
    query: QueryProductByCategoryDto,
  ): Promise<[number, ProductModel[]]>;

  createProductCategory(
    payload: CreateProductCategoryDto,
  ): Promise<ProductCategoryModel>;

  updateProductCategory(
    id: string,
    payload: UpdateProductCategoryDto,
  ): Promise<[number, ProductCategoryModel[]]>;

  deleteProductCategory(id: string): Promise<[number, ProductCategoryModel[]]>;
}

export const IProductCategoryService = Symbol('IProductCategoryService');
