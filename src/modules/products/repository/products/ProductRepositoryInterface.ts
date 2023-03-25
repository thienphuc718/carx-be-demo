import {
  ProductAttributeSelectedModel,
  ProductCategorySelectedModel,
  ProductVariantModel,
} from '../../../../models';
import { ProductModel } from '../../../../models';
import {
  CreateProductAttributeSelectedEntityDto,
  CreateProductCategorySelectedEntityDto,
  CreateProductEntityDto,
  ProductEntityDto,
  UpdateProductEntityDto,
} from '../../dto/ProductDto';

export interface IProductRepository {
  findAllByCondition(
    limit: number,
    offset: number,
    condition: any,
    order_by?: any,
    order_type?: any,
  ): Promise<ProductModel[]>;
  countByCondition(condition: any): Promise<number>;
  findById(id: string): Promise<ProductModel>;
  findProductVariantByCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<ProductVariantModel[]>;

  findProductCategorySelectedByCondition(
    condition: any,
  ): Promise<ProductCategorySelectedModel[]>;
  findProductAttributeSelectedByCondition(
    condition: any,
  ): Promise<ProductAttributeSelectedModel[]>;

  create(
    payload: CreateProductEntityDto,
    callback: (transaction: any, newProduct: ProductModel) => Promise<void>,
  ): Promise<ProductModel>;
  bulkCreateProductAttributeSelected(
    payload: CreateProductAttributeSelectedEntityDto[],
    transaction: any,
  ): Promise<ProductAttributeSelectedModel[]>;
  bulkCreateProductCategorySelected(
    payload: CreateProductCategorySelectedEntityDto[],
    transaction: any,
  ): Promise<ProductCategorySelectedModel[]>;

  updateProduct(
    id: string,
    payload: UpdateProductEntityDto,
    callback: (transaction: any) => Promise<void>,
  ): Promise<[number, ProductModel[]]>;
  updateProductCategorySelectedByCondition(
    payload: any,
    condition: any,
    transaction: any,
  ): Promise<[number]>;
  updateProductAttributeSelectedByCondition(
    payload: any,
    condition: any,
    transaction: any,
  ): Promise<[number]>;

  deleteProduct(
    id: string,
    callback: (transaction: any) => Promise<void>,
  ): Promise<[number, ProductModel[]]>;
  deleteProductAttributeSelected(
    productId: string,
    transaction: any,
  ): Promise<any>;
  deleteProductCategorySelected(
    productId: string,
    transaction: any,
  ): Promise<any>;
  findAllByConditionRandomlyOrdered(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<ProductModel[]>;
  findAllByConditionV2(limit: number, offset: number, condition: any): Promise<ProductModel[]>;
  findAllByConditionWithoutPagination(condition: any): Promise<ProductModel[]>;
  updateByCondition(condition: any, payload: any): Promise<[number, ProductModel[]]>
  findOneByCondition(condition: any) : Promise<ProductModel>;
}

export const IProductRepository = Symbol('IProductRepository');
