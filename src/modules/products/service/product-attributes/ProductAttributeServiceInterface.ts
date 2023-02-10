import { ProductAttributeModel } from '../../../../models/ProductAttributes';
import { PaginationDto } from '../../dto';
import {
  ProductAttributeValueDto,
  CreateProductAttributeEntityDto,
  UpdateProductAttributeDto,
} from '../../dto/ProductAttributeDto';

export interface IProductAttributeService {
  getProductAttributeList(
    pagination: PaginationDto,
  ): Promise<ProductAttributeModel[]>;

  getProductAttributeByCondition(
    condition: any,
  ): Promise<ProductAttributeModel>;

  countProductAttributeByCondition(condition: any): Promise<number>;

  getProductAttributeDetail(id: string): Promise<ProductAttributeModel>;

  createProductAttribute(
    payload: CreateProductAttributeEntityDto,
  ): Promise<ProductAttributeModel>;

  updateProductAttribute(
    id: string,
    payload: UpdateProductAttributeDto,
  ): Promise<ProductAttributeModel>;

  bulkAddValue(
    id: string,
    values: ProductAttributeValueDto[],
  ): Promise<boolean>;

  createProductAttributeValue(
    id: string,
    payload: ProductAttributeValueDto,
  ): Promise<ProductAttributeModel>;

  deleteProductAttribute(
    ids: string[],
  ): Promise<[number, ProductAttributeModel[]]>;

  deleteProductAttributeValues(
    id: string,
    codes: string[],
  ): Promise<ProductAttributeModel>;
}

export const IProductAttributeService = Symbol('IProductAttributeService');
