import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { StaffModel, UserModel, RoleModel } from '../../../models';
import { UpdateStaffEntityDto } from '../dto/StaffDto';
import { IStaffRepository } from './StaffRepositoryInterface';
import {getTextSearchString, removeVietnameseTones} from "../../../helpers/stringHelper";
import { Sequelize } from "sequelize-typescript";
import { Op } from "sequelize";

@Injectable()
export class StaffRepositoryImplementation implements IStaffRepository {
  constructor(
    @InjectModel(StaffModel)
    private staffModel: typeof StaffModel,
    private sequelize: Sequelize
  ) {}

  findAllByCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<StaffModel[]> {
    let tsVectorSearchString =  null;
    if (condition.name) {
      tsVectorSearchString = getTextSearchString(condition.name);
      condition.tsv_converted_name = {
        [Op.match]: this.sequelize.fn('to_tsquery', tsVectorSearchString)
      };
      delete condition.name;
    }
    return this.staffModel.findAll({
      limit: limit,
      offset: offset,
      where: {
        ...condition,
        is_deleted: false,
      },
      include: [
        {
          model: UserModel,
          attributes: { exclude: ['password', 'token'] },
          include: [
            {
              model: RoleModel,
              required: false,
            },
          ],
        },
      ],
      order: [
        tsVectorSearchString ?
          this.sequelize.literal(`ts_rank(staffs.tsv_converted_name, to_tsquery('${tsVectorSearchString}')) desc`)
            :
          ['created_at', 'desc']
      ],
    });
  }

  async findOneById(id: string): Promise<StaffModel> {
    return this.staffModel.findOne({
      where: {
        id: id,
        is_deleted: false,
      },
      include: [
        {
          model: UserModel,
          attributes: { exclude: ['password', 'token'] },
          include: [
            {
              model: RoleModel,
              required: false,
            },
          ],
        },
      ],
    });
  }

  create(
    payload: any,
    transaction?: any,
  ): Promise<StaffModel> {
    return this.staffModel.create(payload, { transaction });
  }

  update(
    id: string,
    payload: UpdateStaffEntityDto,
  ): Promise<[number, StaffModel[]]> {
    return this.staffModel.update(payload, { where: { id }, returning: true });
  }

  delete(id: string): void {
    this.staffModel.update(
      { is_deleted: true },
      {
        where: {
          id: id,
        },
      },
    );
  }

  count(condition: any): Promise<number> {
    let tsVectorSearchString =  null;
    if (condition.name) {
      tsVectorSearchString = getTextSearchString(condition.name);
      condition.tsv_converted_name = {
        [Op.match]: this.sequelize.fn('to_tsquery', `'${tsVectorSearchString}'`)
      };
      delete condition.name;
    }
    return this.staffModel.count({
      where: {
        ...condition,
        is_deleted: false,
      },
    });
  }
}
