import { ICustomerRepository } from './CustomerRepositoryInterface';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  CustomerModel,
  CustomerCategoryRelationsModel,
} from '../../../../models';
import { Sequelize } from 'sequelize-typescript';
import { CarModel, OrderModel, UserModel } from '../../../../models';
import { getTextSearchString } from '../../../../helpers/stringHelper';
import { Op } from 'sequelize';

@Injectable()
export class CustomerRepositoryImplementation implements ICustomerRepository {
  constructor(
    @InjectModel(CustomerModel)
    private customerModel: typeof CustomerModel,
    @InjectModel(CustomerCategoryRelationsModel)
    private customerCategoryRelationsModel: typeof CustomerCategoryRelationsModel,
    private sequelize: Sequelize,
  ) {}

  findAllByCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<CustomerModel[]> {
    const { is_verified, ...rest } = condition;
    const userCondition: Record<string, boolean> = { is_deleted: false };
    let tsVectorSearchString = null;
    if (rest.full_name) {
      tsVectorSearchString = getTextSearchString(rest.full_name);
      rest.tsv_converted_full_name = {
        [Op.match]: this.sequelize.fn('to_tsquery', tsVectorSearchString),
      };
      delete rest.full_name;
    }
    if (is_verified !== undefined && is_verified !== null) {
      userCondition.is_verified = is_verified;
    }
    return this.customerModel.findAll({
      limit: limit,
      offset: offset,
      where: {
        ...rest,
        is_deleted: false,
      },
      include: [
        {
          model: OrderModel,
          as: 'orders',
          required: false,
          where: {
            is_deleted: false,
          },
          order: [['created_at', 'desc']],
        },
        {
          model: CarModel,
          as: 'car_details',
          required: false,
          where: {
            is_deleted: false,
          },
        },
        {
          model: UserModel,
          as: 'user_details',
          required: true,
          where: {
            ...userCondition,
          },
          attributes: {
            exclude: [
              'id',
              'token',
              'password',
              'method',
              'otp',
              'schema',
              'role_id',
              'is_banned',
              'social_info',
              'current_location',
              'otp_expiry_time',
            ],
          },
        },
      ],
      order: [
        tsVectorSearchString
          ? this.sequelize.literal(`
            ts_rank(customers.tsv_converted_full_name, to_tsquery('${tsVectorSearchString}')) desc`)
          : ['created_at', 'desc'],
      ],
    });
  }

  findOneByCondition(condition: any): Promise<CustomerModel> {
    return this.customerModel.findOne({
      where: {
        ...condition,
        is_deleted: false,
      },
      include: [
        {
          model: OrderModel,
          as: 'orders',
          required: false,
          where: {
            is_deleted: false,
          },
          order: [['created_at', 'desc']],
        },
        {
          model: CarModel,
          as: 'car_details',
          required: false,
          where: {
            is_deleted: false,
          },
        },
        {
          model: UserModel,
          as: 'user_details',
          required: false,
          where: {
            is_deleted: false,
          },
          attributes: {
            exclude: [
              'id',
              'token',
              'password',
              'method',
              'otp',
              'schema',
              'role_id',
              'is_banned',
              'social_info',
              'current_location',
              'phone_number',
              'otp_expiry_time',
            ],
          },
        },
      ],
    });
  }

  countByCondition(condition: any, schema: string): Promise<number> {
    const { is_verified, ...rest } = condition;
    const userCondition: Record<string, boolean> = { is_deleted: false };
    if (is_verified !== undefined && is_verified !== null) {
      userCondition.is_verified = is_verified;
    }
    if (schema) {
      let tsVectorSearchString = null;
      if (rest.full_name) {
        tsVectorSearchString = getTextSearchString(rest.full_name);
        rest.tsv_converted_full_name = {
          [Op.match]: this.sequelize.fn('to_tsquery', tsVectorSearchString),
        };
        delete rest.full_name;
      }
      return this.customerModel.count({
        where: {
          ...rest,
          is_deleted: false,
        },
        include: [
          {
            model: UserModel,
            required: true,
            where: {
              ...userCondition,
            },
          },
        ],
      });
    }
  }

  findById(id: string): Promise<CustomerModel> {
    return this.customerModel.findOne({
      where: {
        id: id,
        is_deleted: false,
      },
      include: [
        {
          model: OrderModel,
          as: 'orders',
          required: false,
          where: {
            is_deleted: false,
          },
          order: [['created_at', 'desc']],
        },
        {
          model: CarModel,
          as: 'car_details',
          required: false,
          where: {
            is_deleted: false,
          },
        },
      ],
    });
  }

  create(payload: any): Promise<CustomerModel> {
    const { category_ids, ...rest } = payload;
    return this.sequelize.transaction(async (t) => {
      const createdCustomer = await this.customerModel.create(rest, {
        transaction: t,
      });
      if (category_ids) {
        await this.customerCategoryRelationsModel.bulkCreate(
          category_ids?.map((categoryId: string) => ({
            category_id: categoryId,
            customer_id: createdCustomer.id,
          })),
          { transaction: t },
        );
      }
      return createdCustomer;
    });
  }

  update(id: string, payload: any): Promise<[number, CustomerModel[]]> {
    return this.customerModel.update(payload, {
      where: {
        id: id,
      },
      returning: true,
    });
  }

  delete(id: string): Promise<number> {
    try {
      return this.customerModel.update(
        { is_deleted: true },
        {
          where: {
            id: id,
          },
          returning: true,
        },
      )[0];
    } catch (error) {
      throw error;
    }
  }

  findAllByConditionWithoutPagination(
    condition: any,
  ): Promise<CustomerModel[]> {
    return this.customerModel.findAll({
      where: {
        ...condition,
        is_deleted: false,
      },
    });
  }
}
