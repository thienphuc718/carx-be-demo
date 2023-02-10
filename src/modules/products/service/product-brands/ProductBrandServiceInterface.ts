import { ProductBrandModel } from '../../../../models/ProductBrands';
import { PaginationDto } from '../../dto';
import {
  CreateProductBrandDto,
  UpdateProductBrandDto,
} from '../../dto/ProductBrandDto';

export interface IProductBrandService {
  getProductBrandList(pagination: PaginationDto): Promise<ProductBrandModel[]>;

  countProductBrandByCondition(condition: any): Promise<number>;

  getProductBrandDetails(id: string): Promise<ProductBrandModel>;

  createProductBrand(
    payload: CreateProductBrandDto,
  ): Promise<ProductBrandModel>;

  updateProductBrand(
    id: string,
    payload: UpdateProductBrandDto,
  ): Promise<ProductBrandModel>;

  deleteProductBrand(ids: string[]): Promise<[number, ProductBrandModel[]]>;
}

export const IProductBrandService = Symbol('IProductBrandService');
