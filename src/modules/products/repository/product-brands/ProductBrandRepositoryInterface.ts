import { ProductBrandModel } from '../../../../models/ProductBrands';
import {
  CreateProductBrandDto,
  UpdateProductBrandDto,
} from '../../dto/ProductBrandDto';

export interface IProductBrandRepository {
  findAllByCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<ProductBrandModel[]>;

  countByCondition(condition: any): Promise<number>;

  findById(id: string): Promise<ProductBrandModel>;

  create(payload: CreateProductBrandDto): Promise<ProductBrandModel>;

  update(
    id: string,
    payload: UpdateProductBrandDto,
  ): Promise<[number, ProductBrandModel[]]>;

  delete(ids: string[]): Promise<[number, ProductBrandModel[]]>;
}

export const IProductBrandRepository = Symbol('IProductBrandRepository');
