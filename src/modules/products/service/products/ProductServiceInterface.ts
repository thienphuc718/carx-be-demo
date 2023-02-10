import { ProductModel } from '../../../../models/Products';
import {
  ProductPayloadDto,
  FilterListProductDto,
  FilterListProductDtoV2, CreateInsuranceProductDto,
} from '../../dto/ProductDto';

export interface IProductService {
  getProductList(getProductsDto: FilterListProductDto): Promise<ProductModel[]>;
  countProductByCondition(condition: any): Promise<number>;
  checkProductSkuExist(sku: string): Promise<boolean>;
  getProductDetail(id: string): Promise<ProductModel>;
  createProduct(
    payload: ProductPayloadDto,
    userId: string,
    serviceCallback?: (
      transaction: any,
      newProduct: ProductModel,
    ) => Promise<void>,
  ): Promise<ProductModel>;
  deleteProduct(
    id: string,
    serviceCallback?: (transaction: any) => Promise<void>,
  ): Promise<[number, ProductModel[]]>;

  updateProduct(id: string, payload: ProductPayloadDto): Promise<ProductModel>;

  // update product and category relation
  updateProductCategory(
    productId: string,
    categoryIds: string[],
    transaction: any,
  ): Promise<void>;

  getProductSelectAttributeIds(productId: string): Promise<string[]>;
  deleteMultipleProducts(ids: string[]): Promise<void>;
  getProductTotalSoldBySku(productSku: string): Promise<number>;
  getRelatedProductsByProductId(product_id: string): Promise<[number, ProductModel[]]>;
  bulkUpload(file: any, userId: string): any;
  getMostViewCountProduct(): Promise<ProductModel[]>;
  getMostCompletedOrderProduct(): Promise<ProductModel[]>;
  addViewCount(productId: string): Promise<ProductModel>;
  getProductListByConditionV2(filterProductDto: FilterListProductDtoV2): Promise<ProductModel[]>;
  getProductListByConditionWithoutPagination(condition: any): Promise<ProductModel[]>;
  createInsuranceProduct(payload: CreateInsuranceProductDto, userId: string): Promise<ProductModel>;
  updateProductByCondition(condition: any, payload: ProductPayloadDto): Promise<boolean>;
  getProductDetailAndAddViewCount(id: string): Promise<ProductModel>;
  getProductDetailByCondition(condition: any): Promise<ProductModel>;
}

export const IProductService = Symbol('IProductService');
