import { ProductAttributeModel } from '../../../../models/ProductAttributes';
import {
  CreateProductAttributeEntityDto,
  UpdateProductAttributeDto,
} from '../../dto/ProductAttributeDto';

export interface IProductAttributeRepository {
  findAllByCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<ProductAttributeModel[]>;

  findOneByCondition(condition: any): Promise<ProductAttributeModel>;

  countByCondition(condition: any): Promise<number>;
  findById(id: string): Promise<ProductAttributeModel>;

  create(
    payload: CreateProductAttributeEntityDto,
  ): Promise<ProductAttributeModel>;

  update(
    id: string,
    payload: UpdateProductAttributeDto,
  ): Promise<[number, ProductAttributeModel[]]>;

  delete(ids: string[]): Promise<[number, ProductAttributeModel[]]>;
}

export const IProductAttributeRepository = Symbol(
  'IProductAttributeRepository',
);
