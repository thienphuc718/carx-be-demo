import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BookingModel } from '../../../models/Bookings';
import { OrderModel } from '../../../models/Orders';
import { CustomerModel } from '../../../models/Customers';
import { OrderItemModel } from '../../../models/OrderItems';
import { AgentModel } from '../../../models/Agents';
import { IBookingRepository } from './BookingRepositoryInterface';
import { ProductModel, ProductVariantModel, ReviewModel, ServiceModel, TransactionModel } from '../../../models';

@Injectable()
export class BookingRepositoryImplementation implements IBookingRepository {
  constructor(
    @InjectModel(BookingModel) private bookingModel: typeof BookingModel,
  ) {}

  findAll(): Promise<BookingModel[]> {
    return this.bookingModel.findAll({
      where: {
        is_deleted: false,
      },
      order: [['created_at', 'desc']],
    });
  }

  findAllByCondition(
    limit: number,
    page: number,
    condition: any,
  ): Promise<BookingModel[]> {
    return this.bookingModel.findAll({
      limit: limit,
      offset: (page - 1) * limit,
      where: {
        ...condition,
        is_deleted: false,
      },
      include: [
        {
          model: OrderModel,
          required: false,
          as: 'order',
          attributes: {
            exclude: [
              'id',
              'agent_promotion_code',
              'transportation_method',
              'type',
              'is_deleted',
              'created_at',
              'updated_at',
              'tracking_code',
              'customer_id',
              'agent_id',
            ],
          },
          include: [
            {
              model: OrderItemModel,
              as: 'items',
              required: false,
              attributes: [
                'price',
                'product_sku',
                'id',
                'is_incurring',
                'quantity',
                'product_id',
              ],
              include: [
                {
                  model: ProductModel,
                  as: 'product',
                  required: false,
                  include: [
                    {
                      model: ServiceModel,
                      as: 'services',
                      required: false,
                    }
                  ]
                }
              ]
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
              as: 'transaction'
            },
          ],
        },
        {
          model: CustomerModel,
          as: 'customer',
          attributes: {
            exclude: [
              'user_id',
              'customer_class_id',
              'customer_club_id',
              'tags',
              'created_at',
              'updated_at',
            ],
          }
        },
        {
          model: AgentModel,
          as: 'agent',
          attributes: {
            exclude: [
              'user_id',
              'payment_method',
              'description',
              'is_deleted',
              'created_at',
              'updated_at',
            ],
          },
        },
      ],
      order: [['updated_at', 'desc']],
    });
  }

  findById(id: string): Promise<BookingModel> {
    return this.bookingModel.findOne({
      where: {
        id: id,
      },      
      include: [
        {
          model: OrderModel,
          required: false,
          attributes: {
            exclude: [
              'id',
              'agent_promotion_code',
              'transportation_method',
              'type',
              'is_deleted',
              'created_at',
              'updated_at',
              'tracking_code',
              'customer_id',
              'agent_id',
            ],
          },
          include: [
            {
              model: OrderItemModel,
              as: 'items',
              required: false,
              attributes: [
                'price',
                'product_sku',
                'id',
                'is_incurring',
                'quantity',
                'product_id',
              ],
              include: [
                {
                  model: ProductModel,
                  as: 'product',
                  required: false,
                  include: [
                    {
                      model: ServiceModel,
                      as: 'services',
                      required: false,
                    }
                  ]
                }
              ]
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
              as: 'transaction'
            },
          ],
        },
        {
          model: CustomerModel,
          required: false,
          attributes: {
            exclude: [
              'user_id',
              'customer_class_id',
              'customer_club_id',
              'tags',
              'created_at',
              'updated_at',
            ],
          },
        },
        {
          model: AgentModel,
          as: 'agent',
          required: false,
          attributes: {
            exclude: [
              'user_id',
              'payment_method',
              'description',
              'is_deleted',
              'created_at',
              'updated_at',
            ],
          },
        },
      ],
    });
  }

  create(payload: any): Promise<BookingModel> {
    return this.bookingModel.create(payload);
  }

  update(id: string, payload: any): Promise<[number, BookingModel[]]> {
    return this.bookingModel.update(payload, {
      where: {
        id: id,
      },
      returning: true,
    });
  }

  delete(id: string): void {
    this.bookingModel.update(
      { is_deleted: true },
      {
        where: {
          id: id,
        },
      },
    );
  }

  count(condition?: any): Promise<number> {
    return this.bookingModel.count({
      where: {
        ...condition,
        is_deleted: false,
      },
    });
  }
}
