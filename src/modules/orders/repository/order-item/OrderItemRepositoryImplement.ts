import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProductModel, ProductVariantModel } from '../../../../models';
import { InsuranceProductModel } from '../../../../models/InsuranceProducts';
import { OrderItemModel } from '../../../../models/OrderItems';
import { UpdateOrderItemPayloadDto } from '../../dto/requests/OrderItemRequestDto';
import { IOrderItemRepository } from './OrderItemRepositoryInterface';

@Injectable()
export class OrderItemRepositoryImplementation implements IOrderItemRepository {
  constructor(
    @InjectModel(OrderItemModel) private orderItemModel: typeof OrderItemModel,
  ) {}

  findAll(): Promise<OrderItemModel[]> {
    return this.orderItemModel.findAll({
      where: {
        is_deleted: false,
      },
      include: [
        {
          model: ProductModel,
          required: false,
          as: 'product',
          attributes: {
            exclude: [
              'is_deleted',
              'agent_id',
              'is_variable',
              'currency_unit',
              'type',
              'slug',
              'note',
              'other_info',
              'tags',
              'brand_id',
              'created_at',
              'updated_at',
            ],
          },
          include: [
            {
              model: ProductVariantModel,
              required: false,
              as: 'variants',
              where: { is_deleted: false },
            },
            {
              model: InsuranceProductModel,
              as: 'insurance_product',
            }
          ],
        },
      ],
      order: [['created_at', 'desc']],
    });
  }

  findAllByCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<OrderItemModel[]> {
    return this.orderItemModel.findAll({
      limit: limit,
      offset: offset,
      where: {
        ...condition,
        is_deleted: false,
      },
      include: [
        {
          model: ProductModel,
          required: false,
          as: 'product',
          attributes: {
            exclude: [
              'is_deleted',
              'agent_id',
              'is_variable',
              'currency_unit',
              'type',
              'slug',
              'note',
              'other_info',
              'tags',
              'brand_id',
              'created_at',
              'updated_at',
            ],
          },
          include: [
            {
              model: ProductVariantModel,
              required: false,
              as: 'variants',
              where: { is_deleted: false },
            },
          ],
        },
      ],
      order: [['created_at', 'desc']],
    });
  }

  findById(id: string): Promise<OrderItemModel> {
    return this.orderItemModel.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: ProductModel,
          required: false,
          as: 'product',
          attributes: {
            exclude: [
              'is_deleted',
              'agent_id',
              'is_variable',
              'currency_unit',
              'type',
              'slug',
              'note',
              'other_info',
              'tags',
              'brand_id',
              'created_at',
              'updated_at',
            ],
          },
          include: [
            {
              model: ProductVariantModel,
              required: false,
              as: 'variants',
              where: { is_deleted: false },
            },
            {
              model: InsuranceProductModel,
              as: 'insurance_product',
            }
          ],
        },
      ],
    });
  }

  async create(payload: any): Promise<OrderItemModel> {
    return await this.orderItemModel.create(payload);
  }

  async update(
    id: string,
    payload: UpdateOrderItemPayloadDto,
  ): Promise<OrderItemModel[]> {
    return (
      await this.orderItemModel.update(payload, {
        where: {
          id: id,
        },
        returning: true,
      })
    )[1];
  }

  delete(id: string): void {
    this.orderItemModel.update(
      { is_deleted: true },
      {
        where: {
          id: id,
        },
      },
    );
  }

  findAllByConditionWithoutPagination(condition: any): Promise<OrderItemModel[]> {
    return this.orderItemModel.findAll({
      where: {
        ...condition,
        is_deleted: false
      }
    })   
  }

  fineOneByCondition(condition: any): Promise<OrderItemModel> {
    return this.orderItemModel.findOne({
      where: {
        ...condition,
        is_deleted: false
      },
      include: [
        {
          model: ProductModel,
          as: 'product',
          attributes: {
            exclude: [
              'is_deleted',
              'agent_id',
              'is_variable',
              'currency_unit',
              'type',
              'slug',
              'note',
              'other_info',
              'tags',
              'brand_id',
              'created_at',
              'updated_at',
            ],
          },
          include: [
            {
              model: InsuranceProductModel,
              as: 'insurance_product',
            }
          ]
        }
      ]
    })
  }
}
