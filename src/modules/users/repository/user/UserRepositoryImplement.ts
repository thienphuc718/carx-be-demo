import { UserCompanyRelationsModel } from './../../../../models/UserCompanyRelations';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from '../../../../models/Users';
import { IUserRepository } from './UserRepositoryInterface';
import {
  CompanyModel,
  AgentModel,
  RoleModel,
  CustomerModel,
  CarModel,
  StaffModel,
  RoleFeatureRelationModel,
  FeatureModel,
} from '../../../../models';

export class UserRepositoryImplementation implements IUserRepository {
  constructor(
    @InjectModel(UserModel) private userModel: typeof UserModel,
    // @InjectModel(UserCompanyRelationsModel)
    // private userCompanyRelationsModel: typeof UserCompanyRelationsModel,
  ) {}

  findAll(schema: string): Promise<UserModel[]> {
    if (schema) {
      return this.userModel.findAll({
        where: {
          is_deleted: false,
        },
        // include: [
        //   {
        //     model: UserCompanyRelationsModel,
        //     as: 'categories',
        //     required: false,
        //     where: { is_deleted: false },
        //     attributes: ['company_id'],
        //     include: [{ model: CompanyModel, as: 'company_details' }],
        //   },
        // ],
        order: [['created_at', 'desc']],
      });
    }
  }

  findAllByCondition(
    limit: number,
    offset: number,
    condition: any,
    schema: string,
  ): Promise<UserModel[]> {
    if (schema) {
      return this.userModel.findAll({
        limit: limit,
        offset: offset,
        where: {
          ...condition,
          is_deleted: false,
        },
        // include: [
        //   {
        //     model: UserCompanyRelationsModel,
        //     as: 'categories',
        //     required: false,
        //     where: { is_deleted: false },
        //     attributes: ['company_id'],
        //     include: [{ model: CompanyModel, as: 'company_details' }],
        //   },
        // ],
        include: [
          {
            model: StaffModel,
            as: 'staff_details',
            where: {
              is_deleted: false,
            }
          },
          {
            model: AgentModel,
            as: 'agent_details',
            where: {
              is_deleted: false,
            }
          },
          {
            model: CustomerModel,
            as: 'customer_details',
            where: {
              is_deleted: false,
            }
          }
        ],
        order: [['created_at', 'desc']],
      });
    }
  }

  findOneByCondition(condition: any, schema: string): Promise<UserModel> {
    if (schema) {
      return this.userModel.findOne({
        where: {
          ...condition,
          is_deleted: false,
        },
        // include: [
        //   {
        //     model: UserCompanyRelationsModel,
        //     as: 'categories',
        //     required: false,
        //     where: { is_deleted: false },
        //     attributes: ['company_id'],
        //     include: [{ model: CompanyModel, as: 'company_details' }],
        //   },
        // ],
        include: [
          {
            model: AgentModel,
            as: 'agent_details',
            required: false,
            where: { is_deleted: false },
            attributes: [
              'id',
              'name',
              'phone_number',
              'address',
              'avatar',
              'images',
              'description',
              'payment_method',
              'created_at',
              'updated_at',
              'category_id'
            ],
          },
          {
            model: RoleModel,
            // required: false,
            include: [
              {
                model: RoleFeatureRelationModel,
                include: [{ model: RoleModel }, { model: FeatureModel }],
              },
            ],
          },
          {
            model: StaffModel,
            // required: false,
            as: 'staff_details'
          },
        ],
      });
    }
  }

  countByCondition(condition: any, schema: string): Promise<number> {
    if (schema) {
      return this.userModel.count({
        where: {
          ...condition,
          is_deleted: false,
        },
      });
    }
  }

  findById(id: string, schema: string): Promise<UserModel> {
    if (schema) {
      return this.userModel.findOne({
        where: {
          id: id,
        },
        include: [
          {
            model: UserCompanyRelationsModel,
            as: 'companies',
            required: false,
            attributes: ['company_id'],
            include: [{ model: CompanyModel, as: 'company_relations' }],
          },
          {
            required: false,
            model: AgentModel,
          },
          {
            model: RoleModel,
            as: 'role',
            required: false,
            attributes: ['id', 'name', 'company_id'],
            where: { is_deleted: false },
            include: [
              {
                model: RoleFeatureRelationModel,
                include: [{ model: RoleModel }, { model: FeatureModel }],
              },
            ],
          },
          {
            model: CustomerModel,
            as: 'customer_details',
            required: false,
            include: [
              {
                model: CarModel,
                required: false,
              },
            ],
          },
          {
            model: StaffModel,
            as: 'staff_details',
            required: false,
          },
        ],
      });
    }
  }

  async create(
    payload: any,
    schema: string,
    callback?: (transaction: any, createdUser: UserModel) => Promise<void>,
  ): Promise<UserModel> {
    if (schema) {
      const createdUser = await this.userModel.create(payload);
      // callback && (await callback(transaction, createdUser));
      return createdUser;
    }
  }

  update(
    id: string,
    payload: any,
    schema: string,
  ): Promise<[number, UserModel[]]> {
    if (schema) {
      return this.userModel.update(payload, {
        where: {
          id: id,
        },
        returning: true,
      });
    }
  }

  delete(id: string, schema: string): void {
    if (schema) {
      this.userModel.update(
        { is_deleted: true },
        {
          where: {
            id: id,
          },
        },
      );
    }
  }

  findAllByConditionWithoutPagination(
    condition: any,
    schema: string,
  ): Promise<UserModel[]> {
    if (schema) {
      return this.userModel.findAll({
        where: {
          ...condition,
          is_deleted: false,
        },
        include: [
          {
            model: UserCompanyRelationsModel,
            as: 'companies',
            required: false,
            attributes: ['company_id'],
            include: [{ model: CompanyModel, as: 'company_relations' }],
          },
          {
            required: false,
            model: AgentModel,
          },
        ],
        order: [['created_at', 'desc']],
      });
    }
  }
}
