import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FeatureModel, RoleFeatureRelationModel, RoleModel } from '../../../models';
import { IRoleRepository } from './RoleRepositoryInterface';
import {getTextSearchString, removeVietnameseTones} from "../../../helpers/stringHelper";
import { Sequelize } from "sequelize-typescript";
import { Op } from "sequelize";

@Injectable()
export class RoleRepositoryImplementation implements IRoleRepository {
  constructor(
    @InjectModel(RoleModel) private roleModel: typeof RoleModel,
    @InjectModel(RoleFeatureRelationModel)
    private roleFeatureModel: typeof RoleFeatureRelationModel,
    private sequelize: Sequelize,
  ) {
    this.roleFeatureModel.removeAttribute('id');
  }

  findAll(): Promise<RoleModel[]> {
    return this.roleModel.findAll({
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
  ): Promise<RoleModel[]> {
    let tsVectorSearchString =  null;
    if (condition.name) {
      tsVectorSearchString = getTextSearchString(condition.name);
      condition.tsv_converted_name = {
        [Op.match]: this.sequelize.fn('to_tsquery', tsVectorSearchString)
      };
      delete condition.name;
    }
    return this.roleModel.findAll({
      limit: limit,
      offset: (page - 1) * limit,
      where: {
        ...condition,
        is_deleted: false,
      },
      include: [
        {
          model: RoleFeatureRelationModel,
          // where: { is_deleted: false },
          include: [{ model: RoleModel }, { model: FeatureModel }],
        },
      ],
      order: [tsVectorSearchString ? this.sequelize.literal(`ts_rank(roles.tsv_converted_name, to_tsquery('${tsVectorSearchString}')) desc`)
          :
        ['updated_at', 'desc']],
    });
  }

  findById(id: string): Promise<RoleModel> {
    return this.roleModel.findOne({
      where: {
        id: id,
        is_deleted: false,
      },
      include: [
        {
          model: RoleFeatureRelationModel,
          // where: { is_deleted: false },
          include: [{ model: RoleModel }, { model: FeatureModel }],
        },
      ],
    });
  }

  create(payload: any): Promise<RoleModel> {
    return this.roleModel.create(payload);
  }

  update(id: string, payload: any): Promise<any> {
    return this.roleModel.update(payload, {
      where: {
        id: id,
      },
      returning: true,
    });
  }

  delete(id: string): void {
    this.roleModel.update(
      { is_deleted: true },
      {
        where: {
          id: id,
        },
      },
    );
  }

  bulkCreateRoleFeatures(payload: any): Promise<RoleFeatureRelationModel[]> {
    return this.roleFeatureModel.bulkCreate(payload);
  }

  deleteRoleFeature(condition: any): Promise<any> {
    return this.roleFeatureModel.destroy({
      where: {
        ...condition,
      },
    });
  }

  countByCondition(condition: any): Promise<number> {
    let tsVectorSearchString =  null;
    if (condition.name) {
      tsVectorSearchString = getTextSearchString(condition.name);
      condition.tsv_converted_name = {
        [Op.match]: this.sequelize.fn('to_tsquery', tsVectorSearchString)
      };
      delete condition.name;
    }
      return this.roleModel.count({
        where: {
          ...condition,
          is_deleted: false,
        }
      })
  }
}
