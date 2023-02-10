import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import {
  AgentModel,
  UserModel,
  ServiceModel,
  ServiceCategoryRelationModel,
  UserCompanyRelationsModel,
  CompanyModel,
} from '../../../models';

import { CreateAgentEntityDto } from '../dto/AgentDto';
import { IAgentRepository } from './AgentRepositoryInterface';
import {getTextSearchString, removeVietnameseTones} from "../../../helpers/stringHelper";
import { Sequelize } from "sequelize-typescript";

@Injectable()
export class AgentRepositoryImplementation implements IAgentRepository {
  constructor(
    @InjectModel(AgentModel)
    private agentModel: typeof AgentModel,
    @InjectModel(ServiceModel) private serviceModel: typeof ServiceModel,
    @InjectModel(ServiceCategoryRelationModel)
    private serviceCategoryRelationModel: typeof ServiceCategoryRelationModel,
    private sequelize: Sequelize
  ) {}
  findAll(
    limit: number,
    offset: number,
    condition?: any,
    order_by?,
    order_type?,
  ): Promise<AgentModel[]> {
    let tsVectorSearchString =  null;
    if (condition.name) {
      tsVectorSearchString = getTextSearchString(condition.name);
      condition.tsv_converted_name = {
        [Op.match]: this.sequelize.fn('to_tsquery', tsVectorSearchString)
      };
      delete condition.name;
    }
    if(!order_by){
      order_by = 'created_at'
    }
    if(!order_type){
      order_type = 'asc'
    }

    return this.agentModel.findAll({
      limit: limit,
      offset: offset,
      where: {
        ...condition
      },
      include: [
        {
          model: UserModel,
          attributes: { exclude: ['password', 'token', 'otp_expiry_time', 'otp'] },
          include: [
            {
              model: UserCompanyRelationsModel,
              as: 'companies',
              required: false,
              attributes: ['company_id'],
              include: [{ model: CompanyModel, as: 'company_relations' }],
            },
          ]
        }
      ],
      order: [
        tsVectorSearchString ?
          this.sequelize.literal(`ts_rank(agents.tsv_converted_name, to_tsquery('${tsVectorSearchString}')) desc`)
             :
          [order_by, order_type]],
    });
  }

  findAllWithoutPaging(
    condition?: any,
  ): Promise<AgentModel[]> {
    return this.agentModel.findAll({
      where: {
        ...condition
      },
      include: [
        {
          model: UserModel,
          attributes: { exclude: ['password', 'token', 'otp_expiry_time', 'otp'] },
          include: [
            {
              model: UserCompanyRelationsModel,
              as: 'companies',
              required: false,
              attributes: ['company_id'],
              include: [{ model: CompanyModel, as: 'company_relations' }],
            },
          ]
        }
      ],
      order: [['created_at', 'desc']],
    });
  }

  async findOneById(id: string): Promise<AgentModel> {
    return this.agentModel.findByPk(id, {
      include: [
        {
          model: UserModel,
          attributes: { exclude: ['password', 'token'] },
          include: [
            {
              model: UserCompanyRelationsModel,
              as: 'companies',
              required: false,
              attributes: ['company_id'],
              include: [{ model: CompanyModel, as: 'company_relations' }],
            },
          ]
        },
        // {
        //   model: PromotionModel,
        //   attributes: ['id', 'name'],
        //   required: false,
        // },
        // {
        //   model: ProductModel,
        //   required: false,
        //   attributes: {
        //     exclude: [
        //       'is_deleted',
        //       'agent_id',
        //       'is_variable',
        //       'currency_unit',
        //       'type',
        //       'slug',
        //       'note',
        //       'other_info',
        //       'tags',
        //       'brand_id',
        //       'created_at',
        //       'updated_at',
        //     ],
        //   },
        //   include: [
        //     {
        //       model: ProductVariantModel,
        //       required: false,
        //       as: 'variants',
        //       where: { is_deleted: false },
        //     },
        //   ],
        // },
        // {
        //   model: ServiceModel,
        //   attributes: ['id', 'name'],
        //   required: false,
        //   include: [
        //     {
        //       model: ServiceCategoryRelationModel,
        //       required: false,
        //       attributes: {
        //         exclude: [
        //           'service_id',
        //           'is_deleted',
        //           'created_at',
        //           'updated_at',
        //         ],
        //       },
        //       include: [
        //         {
        //           model: ServiceCategoryModel,
        //           // where: { is_deleted: false },
        //           required: false,
        //           attributes: {
        //             exclude: [
        //               'id',
        //               'slug',
        //               'is_deleted',
        //               'created_at',
        //               'updated_at',
        //             ],
        //           },
        //         },
        //       ],
        //     },
        //   ],
        // },
      ],
    });
  }

  create(payload: CreateAgentEntityDto, transaction?: any): Promise<AgentModel> {
    return this.agentModel.create(payload, { transaction });
  }

  update(
    id: string,
    payload: any,
  ): Promise<[number, AgentModel[]]> {
    return this.agentModel.update(payload, { where: { id }, returning: true });
  }

  count(condition?: Record<string, any>): Promise<number> {
    let tsVectorSearchString =  null;
    if (condition.name) {
      tsVectorSearchString = getTextSearchString(condition.name);
      condition.tsv_converted_name = {
        [Op.match]: this.sequelize.fn('to_tsquery', tsVectorSearchString)
      };
      delete condition.name;
    }
    return this.agentModel.count({
      where: {
        ...condition
      }
    })
  }

  async getAgentIdsByServiceCategory(categoryId: string): Promise<string[]> {
    let services = await this.serviceModel.findAll({
      where: { is_deleted: false },
      include: [
        {
          model: ServiceCategoryRelationModel,
          required: true,
          where: {
            category_id: categoryId,
            is_deleted: false,
          }
        },
      ],
      attributes: ['agent_id', 'id']
    });
    let agentIds = services.map(service => service.agent_id);
    return agentIds
  }

  queryRaw(raw: string) {
    return this.sequelize.query(raw)
  }

  whereRaw(limit: number, offset: number, condition?: any, rawCondition?: any): Promise<AgentModel[]> {
    return this.agentModel.findAll({
      limit: limit,
      offset: offset,
      where: {
        [Op.and]: [
          condition,
          this.sequelize.literal(rawCondition)
        ]
      },
      include: [
        {
          model: UserModel,
          attributes: { exclude: ['password', 'token'] },
          include: [
            {
              model: UserCompanyRelationsModel,
              as: 'companies',
              required: false,
              attributes: ['company_id'],
              include: [{ model: CompanyModel, as: 'company_relations' }],
            },
          ]
        }
      ],
      order: [['created_at', 'desc']],
    });
  }

  whereRawWithoutPagination(condition: any, rawCondition: any): Promise<AgentModel[]> {
    return this.agentModel.findAll({
      where: {
        [Op.and]: [
          condition,
          this.sequelize.literal(rawCondition),
        ]
      },
      include: [
        {
          model: UserModel,
          attributes: { exclude: ['password', 'token', 'otp_expiry_time', 'otp'] },
          include: [
            {
              model: UserCompanyRelationsModel,
              as: 'companies',
              required: false,
              attributes: ['company_id'],
              include: [{ model: CompanyModel, as: 'company_relations' }],
            },
          ]
        }
      ],
      order: [['updated_at', 'desc']],
    });
  }

  countRaw(condition?: any, rawCondition?: any): any {
    return this.agentModel.count({
      where: {
        [Op.and]: [
          condition,
          this.sequelize.literal(rawCondition)
        ]
      }
    })
  }
  findOneByCondition(condition: any): Promise<AgentModel> {
    return this.agentModel.findOne({
      where: {
        ...condition,
        is_deleted: false,
        is_hidden: false,
      }
    });
  }
}
