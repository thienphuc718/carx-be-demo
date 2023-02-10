import { InjectModel } from '@nestjs/sequelize';
import {
  CarModel,
  CustomerModel,
  BookingModel,
  AgentModel,
  OrderModel,
  OrderItemModel,
  ProductModel,
  ServiceModel,
  OnsiteRescueResponseModel,
} from '../../../../models';
import { OnsiteRescueRequestModel } from '../../../../models';
import { IOnsiteRescueRequestRepository } from './OnsiteRescueRequestRepositoryInterface';
import { Op } from 'sequelize';

export class OnsiteRescueRequestRepositoryImplementation
  implements IOnsiteRescueRequestRepository
{
  constructor(
    @InjectModel(OnsiteRescueRequestModel)
    private onsiteRescueRequestModel: typeof OnsiteRescueRequestModel,
  ) {}

  findAllByCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<OnsiteRescueRequestModel[]> {
    return this.onsiteRescueRequestModel.findAll({
      limit: limit,
      offset: offset,
      where: {
        ...condition,
        is_deleted: false,
      },
      include: [
        {
          model: CustomerModel,
          as: 'customer',
          attributes: ['id', 'full_name', 'phone_number', 'is_deleted', 'avatar', 'user_id'],
          include: [
            {
              model: CarModel,
              as: 'car_details',
              attributes: {
                exclude: [
                  'created_at',
                  'updated_at',
                  'customer_id',
                  'is_deleted',
                ],
              },
            },
          ],
        },
        {
          model: OnsiteRescueResponseModel,
          as: 'responses',
          required: false,
        },
      ],
      order: [['updated_at', 'desc']],
    });
  }

  findOneByCondition(condition: any): Promise<OnsiteRescueRequestModel> {
    return this.onsiteRescueRequestModel.findOne({
      where: {
        ...condition,
        is_deleted: false,
      },
      include: [
        {
          model: CustomerModel,
          as: 'customer',
          attributes: ['id', 'full_name', 'phone_number', 'is_deleted', 'avatar', 'user_id'],
          include: [
            {
              model: CarModel,
              as: 'car_details',
              attributes: {
                exclude: [
                  'created_at',
                  'updated_at',
                  'customer_id',
                  'is_deleted',
                ],
              },
            },
          ],
        },
      ],
    });
  }

  getCurrentOfCustomer(customerId: string): Promise<OnsiteRescueRequestModel> {
    return this.onsiteRescueRequestModel.findOne({
      where: {
        customer_id: customerId,
        status: {
          [Op.or]: ['SENT', 'PROCESSING'],
        },
        is_deleted: false,
      },
      order: [['created_at', 'desc']],
      include: [
        {
          model: CustomerModel,
          as: 'customer',
          attributes: ['id', 'full_name', 'phone_number', 'is_deleted', 'avatar', 'user_id'],
          include: [
            {
              model: CarModel,
              as: 'car_details',
              attributes: {
                exclude: [
                  'created_at',
                  'updated_at',
                  'customer_id',
                ],
              },
            },
          ],
        },
        {
          model: BookingModel,
          as: 'booking',
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
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          model: AgentModel,
          as: 'agent',
        },
      ],
    });
  }
  countByCondition(condition: any): Promise<number> {
    return this.onsiteRescueRequestModel.count({
      where: {
        ...condition,
        is_deleted: false,
      },
    });
  }

  findById(id: string): Promise<OnsiteRescueRequestModel> {
    return this.onsiteRescueRequestModel.findByPk(id, {
      include: [
        {
          model: CustomerModel,
          as: 'customer',
          attributes: ['id', 'full_name', 'phone_number', 'is_deleted', 'avatar', 'user_id'],
          include: [
            {
              model: CarModel,
              as: 'car_details',
              attributes: {
                exclude: [
                  'created_at',
                  'updated_at',
                  'customer_id',
                  'is_deleted',
                ],
              },
            },
          ],
        },
        {
          model: OnsiteRescueResponseModel,
          as: 'responses',
          required: false,
        },
      ],
    });
  }

  create(payload: any): Promise<OnsiteRescueRequestModel> {
    return this.onsiteRescueRequestModel.create(payload);
  }

  update(
    id: string,
    payload: any,
  ): Promise<[number, OnsiteRescueRequestModel[]]> {
    return this.onsiteRescueRequestModel.update(payload, {
      where: {
        id: id,
      },
      returning: true,
    });
  }

  delete(id: string): void {
    throw new Error('Method not implemented.');
  }
}
