import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ProductCategoryModel } from '../../../../models/ProductCategories';
import { ProductCategorySelectedModel } from '../../../../models/ProductCategorySelected';
import { ProductModel } from '../../../../models/Products';
import { ProductVariantModel } from '../../../../models/ProductVariants';
import {
  CreateProductCategoryDto,
  UpdateProductCategoryDto,
} from '../../dto/ProductCategoryDto';
import { IProductCategoryRepository } from './ProductCategoryRepositoryInterface';

@Injectable()
export class ProductCategoryRepositoryImplementation
  implements IProductCategoryRepository
{
  constructor(
    @InjectModel(ProductCategoryModel)
    private productCategoryModel: typeof ProductCategoryModel,
    @InjectModel(ProductCategorySelectedModel)
    private productCategorySelectedModel: typeof ProductCategorySelectedModel,
  ) {}

  findAllByConditionWithoutPaginate(
    condition: any,
  ): Promise<ProductCategoryModel[]> {
    return this.productCategoryModel.findAll({
      where: {
        ...condition,
        is_deleted: false,
      },
      order: [['created_at', 'desc']],
    });
  }

  findAllByCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<ProductCategoryModel[]> {
    return this.productCategoryModel.findAll({
      limit: limit,
      offset: offset,
      where: {
        ...condition,
        is_deleted: false,
      },
      order: [['created_at', 'desc']],
    });
  }

  findOneById(id: string): Promise<ProductCategoryModel> {
    return this.productCategoryModel.findOne({
      where: {
        id,
        is_deleted: false,
      },
    });
  }

  countByCondition(condition: any): Promise<number> {
    return this.productCategoryModel.count({
      where: {
        ...condition,
        is_deleted: false,
      },
    });
  }

  findProductOfCategory(
    categoryId: string,
    limit: number,
    offset: number,
    productOptions,
    priceOptions,
    orderOptions,
  ): Promise<any> {
    return this.productCategorySelectedModel.findAll({
      limit,
      offset,
      where: {
        category_id: categoryId,
        is_deleted: false,
      },
      include: [
        {
          model: ProductModel,
          where: productOptions,
          include: [
            {
              model: ProductVariantModel,
              where: priceOptions,
            },
          ],
        },
      ],
      order: orderOptions,
    });
  }

  countProductOfcategory(
    categoryId: string,
    productOptions,
    priceOptions,
  ): Promise<number> {
    return this.productCategorySelectedModel.count({
      where: {
        category_id: categoryId,
        is_deleted: false,
      },
      include: [
        {
          model: ProductModel,
          where: productOptions,
          include: [
            {
              model: ProductVariantModel,
              where: priceOptions,
            },
          ],
        },
      ],
    });
  }

  create(payload: CreateProductCategoryDto): Promise<ProductCategoryModel> {
    return this.productCategoryModel.create(payload);
  }

  updateById(
    id: string,
    payload: UpdateProductCategoryDto,
  ): Promise<[number, ProductCategoryModel[]]> {
    return this.productCategoryModel.update(payload, {
      where: {
        id: id,
      },
      returning: true,
    });
  }

  delete(ids: string[]): Promise<[number, ProductCategoryModel[]]> {
    return this.productCategoryModel.update(
      { is_deleted: true },
      {
        where: {
          id: { [Op.in]: ids },
        },
        returning: true,
      },
    );
  }
}
