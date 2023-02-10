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
  TrailerFormerRescueResponseModel,
  TrailerLaterRescueResponseModel,
} from '../../../../models';
import { TrailerRescueRequestModel } from '../../../../models/TrailerRescueRequests';
import { ITrailerRescueRequestRepository } from './TrailerRescueRequestRepositoryInterface';
import { Op } from 'sequelize';

export class TrailerRescueRequestRepositoryImplementation
  implements ITrailerRescueRequestRepository
{
  constructor(
    @InjectModel(TrailerRescueRequestModel)
    private trailerRescueRequestModel: typeof TrailerRescueRequestModel,
  ) {}

  findAllByCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<TrailerRescueRequestModel[]> {
    return this.trailerRescueRequestModel.findAll({
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
          attributes: [
            'id',
            'full_name',
            'phone_number',
            'is_deleted',
            'avatar',
            'user_id',
          ],
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
          model: TrailerFormerRescueResponseModel,
          as: 'former_responses',
          required: false,
        },
        {
          model: TrailerLaterRescueResponseModel,
          as: 'later_responses',
          required: false,
        },
        {
          model: AgentModel,
          as: 'former_agent',
          attributes: ['name', 'phone_number', 'user_id', 'avatar', 'address', 'geo_info', 'longitude', 'latitude', 'rating_points'],
        },
        {
          model: AgentModel,
          as: 'later_agent',
          attributes: ['name', 'phone_number', 'user_id', 'avatar', 'address', 'geo_info', 'longitude', 'latitude', 'rating_points'],
        },
      ],
      order: [['updated_at', 'desc']],
    });
  }

  findOneByCondition(condition: any): Promise<TrailerRescueRequestModel> {
    return this.trailerRescueRequestModel.findOne({
      where: {
        ...condition,
        is_deleted: false,
      },
      include: [
        {
          model: CustomerModel,
          as: 'customer',
          attributes: [
            'id',
            'full_name',
            'phone_number',
            'is_deleted',
            'avatar',
            'user_id',
          ],
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
          model: AgentModel,
          as: 'former_agent',
          attributes: ['name', 'phone_number', 'user_id', 'avatar', 'address', 'geo_info', 'longitude', 'latitude', 'rating_points'],
        },
        {
          model: AgentModel,
          as: 'later_agent',
          attributes: ['name', 'phone_number', 'user_id', 'avatar', 'address', 'geo_info', 'longitude', 'latitude', 'rating_points'],
        },
      ],
    });
  }

  getCurrentOfCustomer(customerId: string): Promise<TrailerRescueRequestModel> {
    return this.trailerRescueRequestModel.findOne({
      where: {
        customer_id: customerId,
        former_status: {
          [Op.or]: ['SENT', 'PROCESSING'],
        },
        later_status: {
          [Op.or]: ['UNSENT', 'SENT' ,'PROCESSING', 'COMPLETED'],
        },
        is_deleted: false,
      },
      order: [['created_at', 'desc']],
      include: [
        {
          model: CustomerModel,
          as: 'customer',
          attributes: [
            'id',
            'full_name',
            'phone_number',
            'is_deleted',
            'avatar',
            'user_id',
          ],
          include: [
            {
              model: CarModel,
              as: 'car_details',
              attributes: {
                exclude: ['created_at', 'updated_at', 'customer_id'],
              },
            },
          ],
        },
        {
          model: BookingModel,
          as: 'former_booking',
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
          model: BookingModel,
          as: 'later_booking',
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
          as: 'former_agent',
          attributes: ['name', 'phone_number', 'user_id', 'avatar', 'address', 'geo_info', 'longitude', 'latitude', 'rating_points'],
        },
        {
          model: AgentModel,
          as: 'later_agent',
          attributes: ['name', 'phone_number', 'user_id', 'avatar', 'address', 'geo_info', 'longitude', 'latitude', 'rating_points'],
        },
      ],
    });
  }
  countByCondition(condition: any): Promise<number> {
    return this.trailerRescueRequestModel.count({
      where: {
        ...condition,
        is_deleted: false,
      },
    });
  }

  findById(id: string): Promise<TrailerRescueRequestModel> {
    return this.trailerRescueRequestModel.findByPk(id, {
      include: [
        {
          model: CustomerModel,
          as: 'customer',
          attributes: [
            'id',
            'full_name',
            'phone_number',
            'is_deleted',
            'avatar',
            'user_id',
          ],
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
          model: TrailerFormerRescueResponseModel,
          as: 'former_responses',
          required: false,
        },
        {
          model: TrailerLaterRescueResponseModel,
          as: 'later_responses',
          required: false,
        },
        {
          model: AgentModel,
          as: 'former_agent',
          attributes: ['name', 'phone_number', 'user_id', 'avatar', 'address', 'geo_info', 'longitude', 'latitude', 'rating_points'],
        },
        {
          model: AgentModel,
          as: 'later_agent',
          attributes: ['name', 'phone_number', 'user_id', 'avatar', 'address', 'geo_info', 'longitude', 'latitude', 'rating_points'],
        },
      ],
    });
  }

  create(payload: any): Promise<TrailerRescueRequestModel> {
    return this.trailerRescueRequestModel.create(payload);
  }

  update(
    id: string,
    payload: any,
  ): Promise<[number, TrailerRescueRequestModel[]]> {
    return this.trailerRescueRequestModel.update(payload, {
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
