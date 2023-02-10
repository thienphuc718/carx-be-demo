import { Inject, Injectable } from '@nestjs/common';
import { IProductBrandService } from './ProductBrandServiceInterface';
import { IProductBrandRepository } from '../../repository/product-brands/ProductBrandRepositoryInterface';
import {
  CreateProductBrandDto,
  UpdateProductBrandDto,
} from '../../dto/ProductBrandDto';
import { ProductBrandModel } from '../../../../models/ProductBrands';
import { PaginationDto } from '../../dto';

@Injectable()
export class ProductBrandServiceImplementation implements IProductBrandService {
  constructor(
    @Inject(IProductBrandRepository)
    private productBrandRepository: IProductBrandRepository,
  ) {}

  getProductBrandList(pagination: PaginationDto): Promise<ProductBrandModel[]> {
    try {
      const { limit, page } = pagination;
      return this.productBrandRepository.findAllByCondition(
        limit,
        (page - 1) * limit,
        {},
      );
    } catch (error) {
      throw error;
    }
  }

  countProductBrandByCondition(condition: any): Promise<number> {
    try {
      return this.productBrandRepository.countByCondition(condition);
    } catch (error) {
      throw error;
    }
  }

  getProductBrandDetails(id: string): Promise<ProductBrandModel> {
    try {
      return this.productBrandRepository.findById(id);
    } catch (error) {
      throw error;
    }
  }

  createProductBrand(
    payload: CreateProductBrandDto,
  ): Promise<ProductBrandModel> {
    return this.productBrandRepository.create(payload);
  }

  async updateProductBrand(
    id: string,
    payload: UpdateProductBrandDto,
  ): Promise<ProductBrandModel> {
    try {
      const productBrand = await this.getProductBrandDetails(id);
      if (!productBrand) {
        throw new Error('Product brand not found');
      }
      const [_, updatedRows] = await this.productBrandRepository.update(
        id,
        payload,
      );
      return updatedRows[0];
    } catch (error) {
      throw error;
    }
  }

  deleteProductBrand(ids: string[]): Promise<[number, ProductBrandModel[]]> {
    try {
      return this.productBrandRepository.delete(ids);
    } catch (error) {
      throw error;
    }
  }
}
