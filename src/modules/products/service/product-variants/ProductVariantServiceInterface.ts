import { ProductVariantModel } from '../../../../models/ProductVariants';
import { PaginationDto } from '../../dto';
import {
  CreateProductVariantPayloadDto,
  UpdateProductVariantPayloadDto,
} from '../../dto/ProductVariantDto';

export interface IProductVariantService {
  getProductVariantList(
    productId: string,
    pagination: PaginationDto,
  ): Promise<ProductVariantModel[]>;
  countProductVariantByCondition(condition: any): Promise<number>;
  getProductVariantDetail(id: string): Promise<ProductVariantModel>;
  createProductVariant(
    payload: CreateProductVariantPayloadDto,
  ): Promise<ProductVariantModel>;

  updateProductVariant(
    id: string,
    payload: UpdateProductVariantPayloadDto,
  ): Promise<[number, ProductVariantModel[]]>;

  deleteProductVariant(id: string): Promise<void>;
  getListFromListSku(skuList: string[]): Promise<ProductVariantModel[]>
}

export const IProductVariantService = Symbol('IProductVariantService');
