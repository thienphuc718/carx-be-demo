import { Inject, Injectable } from '@nestjs/common';
import { flattenDeep } from 'lodash';
import { ProductCategoryModel } from '../../../../models/ProductCategories';
import {
  CreateProductCategoryDto,
  QueryProductByCategoryDto,
  UpdateProductCategoryDto,
} from '../../dto/ProductCategoryDto';
import { IProductCategoryRepository } from '../../repository/product-categories/ProductCategoryRepositoryInterface';
import { PaginationDto } from '../../dto';
import { IProductCategoryService } from './ProductCategoryServiceInterface';
import { ProductModel } from '../../../../models/Products';
import { productQueryHelper } from '../../helper';

@Injectable()
export class ProductCategoryServiceImplementation
  implements IProductCategoryService
{
  constructor(
    @Inject(IProductCategoryRepository)
    private productCategoryRepository: IProductCategoryRepository,
  ) {}

  getProductCategoryByCondition(
    pagination: PaginationDto,
    condition: any,
  ): Promise<ProductCategoryModel[]> {
    try {
      const { limit, page } = pagination;
      return this.productCategoryRepository.findAllByCondition(
        limit,
        (page - 1) * limit,
        condition,
      );
    } catch (error) {
      throw error;
    }
  }

  getProductCategoryChildren(id: string): Promise<ProductCategoryModel[]> {
    try {
      return this.productCategoryRepository.findAllByConditionWithoutPaginate({
        parent_id: id,
      });
    } catch (error) {
      throw error;
    }
  }

  getProductByCategoryId(
    categoryId: string,
    query: QueryProductByCategoryDto,
  ): Promise<[number, ProductModel[]]> {
    const { limit, page } = query;
    const { productOptions, priceOptions, orderOptions } =
      productQueryHelper(query);
    return Promise.all([
      this.productCategoryRepository.countProductOfcategory(
        categoryId,
        productOptions,
        priceOptions,
      ),
      this.productCategoryRepository.findProductOfCategory(
        categoryId,
        limit,
        (page - 1) * limit,
        productOptions,
        priceOptions,
        orderOptions,
      ),
    ]);
  }

  async createProductCategory(
    payload: CreateProductCategoryDto,
  ): Promise<ProductCategoryModel> {
    try {
      const productCategory = await this.productCategoryRepository.create(
        payload,
      );
      return productCategory;
    } catch (error) {
      throw error;
    }
  }

  countProductCategoryByCondition(condition: any): Promise<number> {
    try {
      return this.productCategoryRepository.countByCondition(condition);
    } catch (error) {
      throw error;
    }
  }

  async updateProductCategory(
    id: string,
    payload: UpdateProductCategoryDto,
  ): Promise<[number, ProductCategoryModel[]]> {
    try {
      const updatedProductCategory =
        await this.productCategoryRepository.updateById(id, payload);
      return updatedProductCategory;
    } catch (error) {
      throw error;
    }
  }

  async deleteProductCategory(
    id: string,
  ): Promise<[number, ProductCategoryModel[]]> {
    try {
      const category = await this.productCategoryRepository.findOneById(id);
      if (!category) {
        throw new Error('Category not found');
      }
      const children: ProductCategoryModel[] = [];
      let continueArray = await this.getProductCategoryChildren(id);
      while (continueArray.length !== 0) {
        const temp = await Promise.all(
          continueArray.map(async (category) => {
            const categoryChildren = await this.getProductCategoryChildren(
              category.id,
            );
            children.push(category);
            return categoryChildren;
          }),
        );
        continueArray = flattenDeep(temp);
      }
      const ids = children.map((category) => category.id);
      return this.productCategoryRepository.delete([...ids, id]);
    } catch (error) {
      throw error;
    }
  }
}
