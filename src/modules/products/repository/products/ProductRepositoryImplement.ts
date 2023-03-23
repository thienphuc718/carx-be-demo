import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProductModel, AgentModel } from '../../../../models';
import {
  CreateProductAttributeSelectedEntityDto,
  CreateProductCategorySelectedEntityDto,
  CreateProductEntityDto,
  UpdateProductEntityDto,
} from '../../dto/ProductDto';

import { IProductRepository } from './ProductRepositoryInterface';
import { ProductAttributeSelectedModel } from '../../../../models';
import { Sequelize } from 'sequelize-typescript';

import {
  ProductBrandModel,
  ProductCategorySelectedModel,
  ProductVariantModel,
  ServiceCategoryModel,
} from '../../../../models';
import { InsuranceProductModel } from "../../../../models";
import { IncludeOptions, Op } from "sequelize";
import { getTextSearchString } from "../../../../helpers/stringHelper";

@Injectable()
export class ProductRepositoryImplementation implements IProductRepository {
  constructor(
    @InjectModel(ProductModel) private productModel: typeof ProductModel,
    @InjectModel(ProductAttributeSelectedModel)
    private productAttributeSelectedModel: typeof ProductAttributeSelectedModel,
    @InjectModel(ProductCategorySelectedModel)
    private productCategorySelectedModel: typeof ProductCategorySelectedModel,
    @InjectModel(ProductVariantModel)
    private productVariantModel: typeof ProductVariantModel,
    private sequelize: Sequelize,
  ) { }

  async findAllByCondition(
    limit: number,
    offset: number,
    condition: any,
    names?: string[],
    order_by?: any,
    order_type?: any,
  ): Promise<ProductModel[]> {
    if (!order_by) {
      order_by = 'view_count'
    }
    if (!order_type) {
      order_type = 'desc'
    }

    const { variantCondition, insuranceProductCondition, ...productCondition } = condition;
    // let tsVectorSearchString = null;
    // if (productCondition.name) {
    //   tsVectorSearchString = getTextSearchString(productCondition.name);
    //   console.log("TSVECTOR STRING: ", tsVectorSearchString);
    //   productCondition.tsv_converted_name = {
    //     [Op.match]: this.sequelize.fn('to_tsquery', tsVectorSearchString)
    //   };
    //   delete productCondition.name;
    // }
    const includeOptions: IncludeOptions[] = [
      {
        model: ProductCategorySelectedModel,
        as: 'categories',
        required: false,
        where: { is_deleted: false },
        attributes: ['category_id'],
        include: [{ model: ServiceCategoryModel, as: 'category_details' }],
      },
      {
        model: ProductVariantModel,
        as: 'variants',
        where: {
          ...variantCondition,
          is_deleted: false,
        },
      },
    ];

    if (condition.is_insurance_product) {
      includeOptions.push({
        model: InsuranceProductModel,
        as: 'insurance_product',
        // required: true,
        where: {
          ...insuranceProductCondition,
        }
      })
    }

    if (names) {
      const products = await this.productModel.findAll({
        limit: limit,
        offset: offset,
        where: {
          ...productCondition,
          name: {
            [Op.iLike]: { [Op.any]: names.map(name => `%${name}%`) },
          }
        },
        include: includeOptions
      });

      // Calculate the match count for each product
      const matchedProducts = products.map(product => {
        const nameWords = product.name.toLowerCase().split(/\s+/);
        const matchCount = names.reduce((count, name) => {
          const nameWordsLowerCase = name.toLowerCase().split(/\s+/);
          const matched = nameWordsLowerCase.filter(word => nameWords.includes(word));
          return count + matched.length;
        }, 0);
        return { product, matchCount };
      });

      // Sort the matched products by match count
      const sortedProducts = matchedProducts.sort((a, b) => b.matchCount - a.matchCount);

      return sortedProducts.map(({ product }) => product);
    }

    const products = await this.productModel.findAll({
      limit: limit,
      offset: offset,
      where: {
        ...productCondition,
      },
      include: includeOptions,
    });

    return products
  }

  findAllByConditionRandomlyOrdered(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<ProductModel[]> {
    return this.productModel.findAll({
      limit: limit,
      offset: offset,
      where: { ...condition },
      include: [
        {
          model: ProductBrandModel,
          required: false,
          as: 'brand',
        },
        {
          model: ProductVariantModel,
          as: 'variants',
          where: {
            is_deleted: false,
          },
        },
        {
          model: ProductCategorySelectedModel,
          as: 'categories',
          required: false,
          where: { is_deleted: false },
          attributes: ['category_id'],
          include: [{ model: ServiceCategoryModel, as: 'category_details' }],
        },
        {
          model: ProductAttributeSelectedModel,
          as: 'attributes',
          required: false,
          where: { is_deleted: false },
          attributes: { exclude: ['product_id'] },
        },
      ],
      order: this.sequelize.random(),
    });
  }

  async countByCondition(condition: any, names: string[]): Promise<number> {
    const { variantCondition, insuranceProductCondition, ...productCondition } = condition;
    // if (productCondition.name) {
    //   const convertedSearchString = getTextSearchString(condition.name);
    //   productCondition.tsv_converted_name = {
    //     [Op.match]: this.sequelize.fn('to_tsquery', convertedSearchString)
    //   };
    //   delete productCondition.name;
    // }
    const count = await this.productModel.count({
      where: {
        ...productCondition,
        is_deleted: false,
        ...(names && {
          name: {
            [Op.iLike]: { [Op.any]: names.map(name => `%${name}%`) },
          },
        }),
      },
      include: [
        {
          model: ProductVariantModel,
          as: 'variants',
          where: {
            ...variantCondition,
            is_deleted: false,
          },
        },
        {
          model: InsuranceProductModel,
          as: 'insurance_product',
          required: condition.is_insurance_product || false,
          where: {
            ...insuranceProductCondition,
          },
        },
      ],
    });

    return count;
  }

  findById(id: string): Promise<ProductModel> {
    return this.productModel.findOne({
      where: {
        id,
        is_deleted: false,
      },
      attributes: { exclude: ['brand_id'] },
      include: [
        {
          model: ProductBrandModel,
          as: 'brand',
          required: false,
        },
        {
          model: ProductVariantModel,
          as: 'variants',
          where: { is_deleted: false },
        },
        {
          model: ProductCategorySelectedModel,
          as: 'categories',
          required: false,
          where: { is_deleted: false },
          attributes: ['category_id'],
          include: [
            {
              model: ServiceCategoryModel,
              as: 'category_details',
              required: false,
            },
          ],
        },
        {
          model: ProductAttributeSelectedModel,
          as: 'attributes',
          required: false,
          where: { is_deleted: false },
          attributes: { exclude: ['product_id'] },
        },
        {
          model: InsuranceProductModel,
          as: 'insurance_product',
        }
      ],
    });
  }

  findProductVariantByCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<ProductVariantModel[]> {
    return this.productVariantModel.findAll({
      limit,
      offset,
      where: {
        ...condition,
        is_deleted: false,
      },
      order: [['created_at', 'desc']],
    });
  }

  findProductCategorySelectedByCondition(
    condition: any,
  ): Promise<ProductCategorySelectedModel[]> {
    return this.productCategorySelectedModel.findAll({
      ...condition,
    });
  }

  findProductAttributeSelectedByCondition(
    condition: any,
  ): Promise<ProductAttributeSelectedModel[]> {
    return this.productAttributeSelectedModel.findAll({
      where: { ...condition, is_deleted: false },
    });
  }

  create(
    productEntity: CreateProductEntityDto,
    callback: (transaction: any, newProduct: ProductModel) => Promise<void>,
  ): Promise<ProductModel> {
    return this.sequelize.transaction(async (t) => {
      const newProduct = await this.productModel.create(productEntity, {
        transaction: t,
      });
      await callback(t, newProduct);
      return newProduct;
    });
  }

  bulkCreateProductAttributeSelected(
    payload: CreateProductAttributeSelectedEntityDto[],
    transaction: any,
  ): Promise<ProductAttributeSelectedModel[]> {
    return this.productAttributeSelectedModel.bulkCreate(payload, {
      transaction,
    });
  }

  bulkCreateProductCategorySelected(
    payload: CreateProductCategorySelectedEntityDto[],
    transaction: any,
  ): Promise<ProductCategorySelectedModel[]> {
    return this.productCategorySelectedModel.bulkCreate(payload, {
      transaction,
    });
  }

  updateProduct(
    id: string,
    payload: UpdateProductEntityDto,
    callback: (transaction: any) => Promise<void>,
  ): Promise<[number, ProductModel[]]> {
    return this.sequelize.transaction(async (t) => {
      const updateResult = await this.productModel.update(payload, {
        where: {
          id: id,
          is_deleted: false,
        },
        returning: true,
        transaction: t,
      });
      await callback(t);
      return updateResult;
    });
  }

  updateProductCategorySelectedByCondition(
    payload: any,
    condition: any,
    transaction: any,
  ): Promise<[number]> {
    return this.productCategorySelectedModel.update(payload, {
      where: { ...condition },
      transaction,
    });
  }

  updateProductAttributeSelectedByCondition(
    payload: any,
    condition: any,
    transaction: any,
  ): Promise<[number]> {
    return this.productAttributeSelectedModel.update(payload, {
      where: { ...condition },
      transaction,
    });
  }

  deleteProduct(
    id: string,
    callback: (transaction: any) => Promise<void>,
  ): Promise<[number, ProductModel[]]> {
    return this.sequelize.transaction(async (t) => {
      const [deletedProduct] = await Promise.all([
        this.productModel.update(
          { is_deleted: true },
          {
            where: {
              id: id,
            },
            returning: true,
            transaction: t,
          },
        ),
      ]);
      await callback(t);
      return deletedProduct;
    });
  }

  deleteProductAttributeSelected(
    productId: string,
    transaction: any,
  ): Promise<any> {
    return this.productAttributeSelectedModel.update(
      { is_deleted: true },
      { where: { product_id: productId }, transaction },
    );
  }

  deleteProductCategorySelected(
    productId: string,
    transaction: any,
  ): Promise<any> {
    return this.productCategorySelectedModel.update(
      { is_deleted: true },
      { where: { product_id: productId }, transaction },
    );
  }

  findAllByConditionV2(limit: number, offset: number, condition: any): Promise<ProductModel[]> {
    let tsVectorSearchString = null;
    if (condition.name) {
      tsVectorSearchString = getTextSearchString(condition.name);
      condition.tsv_converted_name = {
        [Op.match]: this.sequelize.fn('to_tsquery', tsVectorSearchString)
      };
      delete condition.name;
    }
    return this.productModel.findAll({
      limit: limit,
      offset: offset,
      where: {
        ...condition,
        is_deleted: false,
      },
      include: [
        {
          model: ProductVariantModel,
          as: 'variants',
          where: {
            is_deleted: false,
          }
        }
      ]
    })
  }
  findAllByConditionWithoutPagination(condition: any): Promise<ProductModel[]> {
    return this.productModel.findAll({
      where: {
        ...condition,
        is_deleted: false,
      },
      // include: [
      //   {
      //     model: ProductVariantModel,
      //     as: 'variants',
      //     where: { is_deleted: false },
      //   },
      //   {
      //     model: ServiceModel,
      //     as: 'services',
      //     where: { is_deleted: false }
      //   },
      //   {
      //     model: InsuranceProductModel,
      //     as: 'insurance_product',
      //   }
      // ]
    })
  }

  updateByCondition(condition: any, payload: any): Promise<[number, ProductModel[]]> {
    return this.productModel.update(payload, {
      where: {
        ...condition,
      },
      returning: true,
    })
  }

  findOneByCondition(condition: any): Promise<ProductModel> {
    return this.productModel.findOne({
      where: {
        ...condition,
      }
    })
  }
}
