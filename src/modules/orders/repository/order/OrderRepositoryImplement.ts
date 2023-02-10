import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  BookingModel, InsuranceContractModel,
  OrderItemModel,
  ProductModel,
  ProductVariantModel,
  ReviewModel,
} from '../../../../models';
import { OrderModel } from '../../../../models';
import { AgentModel } from '../../../../models';
import { CustomerModel } from '../../../../models';
import { CarModel } from '../../../../models';
import { TransactionModel } from '../../../../models/Transactions';
import { UpdateOrderPayloadDto } from '../../dto/requests/OrderRequestDto';
import { IOrderRepository } from './OrderRepositoryInterface';

@Injectable()
export class OrderRepositoryImplementation implements IOrderRepository {
  constructor(@InjectModel(OrderModel) private orderModel: typeof OrderModel) {}

  findAll(): Promise<OrderModel[]> {
    return this.orderModel.findAll({
      where: {
        is_deleted: false,
      },
      order: [['created_at', 'desc']],
    });
  }

  findAllByCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<OrderModel[]> {
    return this.orderModel.findAll({
      limit: limit,
      offset: offset,
      where: {
        ...condition,
        is_deleted: false,
      },
      include: [
        {
          model: OrderItemModel,
          as: 'items',
          separate: true,
          required: false,
          attributes: [
            'id',
            'quantity',
            'price',
            'product_sku',
            'image',
            'product_id',
            'created_at',
            'updated_at',
          ],
          include: [
            {
              model: ProductModel,
              as: 'product',
              required: false,
              include: [
                {
                  model: ProductVariantModel,
                  as: 'variants',
                  required: false,
                },
              ],
            },
          ],
          // order: [['guarantee_time', 'desc']],
        },
        {
          model: CustomerModel,
          as: 'customer',
          required: false,
          attributes: ['id', 'full_name', 'phone_number', 'address', 'is_deleted', 'avatar']
        },
        {
          model: AgentModel,
          as: 'agent',
          required: false,
          attributes: ['id', 'name', 'address', 'avatar', 'rating_points'],
        },
        {
          model: ReviewModel,
          as: 'review',
          required: false,
          attributes: [
            'id',
            'points',
            'content',
            'customer_id',
            'images',
            'created_at',
            'updated_at',
          ],
        },
        {
          model: TransactionModel,
          as: 'transaction',
        },
        {
          model: InsuranceContractModel,
          as: 'insurance_contract',
        }
      ],
      order: [['updated_at', 'desc']],
    });
  }

  findById(id: string): Promise<OrderModel> {
    return this.orderModel.findOne({
      where: {
        id: id,
        is_deleted: false,
      },
      include: [
        {
          model: OrderItemModel,
          as: 'items',
          required: false,
          attributes: ['id', 'quantity', 'price', 'product_sku', 'product_id'],
          include: [
            {
              model: ProductModel,
              as: 'product',
              required: false,
              include: [
                {
                  model: ProductVariantModel,
                  as: 'variants',
                  required: false,
                },
              ],
            },
          ],
          order: [['guarantee_time', 'desc']],
        },
        {
          model: AgentModel,
          as: 'agent',
          required: false,
          attributes: ['id', 'name', 'address', 'avatar', 'rating_points'],
        },
        {
          model: CustomerModel,
          as: 'customer',
          required: false,
          attributes: ['id', 'full_name', 'phone_number', 'address', 'is_deleted', 'avatar'],
          include: [
            {
              model: CarModel,
              as: 'car_details',
              required: false,
              attributes: [
                'id',
                'brand',
                'model_name',
                'model_year',
                'car_no',
                'color',
                'tire_no',
                'vin_no',
              ],
            },
          ],
        },
        {
          model: ReviewModel,
          as: 'review',
          required: false,
          attributes: [
            'id',
            'points',
            'content',
            'images',
            'created_at',
            'updated_at',
          ],
        },
        {
          model: BookingModel,
          as: 'booking',
          attributes: [
            'id',
            'booking_no',
            'online_payment_attempt'
          ]
        },
        {
          model: TransactionModel,
          as: 'transaction',
        },
        {
          model: InsuranceContractModel,
          as: 'insurance_contract',
        }
      ],
    });
  }

  create(payload: any): Promise<OrderModel> {
    return this.orderModel.create(payload);
  }

  async update(
    id: string,
    payload: UpdateOrderPayloadDto,
  ): Promise<OrderModel[]> {
    const result = await this.orderModel.update(payload, {
      where: {
        id: id,
      },
      returning: true,
    });
    return result[1];
  }

  delete(id: string): void {
    this.orderModel.update(
      { is_deleted: true },
      {
        where: {
          id: id,
        },
      },
    );
  }

  countByCondition(condition: any): Promise<number> {
    return this.orderModel.count({
      where: {
        ...condition,
        is_deleted: false,
      },
    });
  }

  sumByCondition(condition: any): Promise<number> {
    return this.orderModel.sum('value', {
      where: {
        ...condition,
        is_deleted: false,
      },
    });
  }

  findAllByConditionWithoutPagination(condition: any): Promise<OrderModel[]> {
    return this.orderModel.findAll({
      where: {
        ...condition,
        is_deleted: false,
      },
      include: [
        {
          model: OrderItemModel,
          as: 'items',
          required: false,
          attributes: ['id', 'quantity', 'price', 'product_sku', 'product_id'],
          include: [
            {
              model: ProductModel,
              as: 'product',
              required: false,
              attributes: ['name', 'status', 'is_deleted', 'type'],
              include: [
                {
                  model: ProductVariantModel,
                  as: 'variants',
                  required: false,
                },
              ],
            },
          ],
        },
      ]
    });
  }
}
