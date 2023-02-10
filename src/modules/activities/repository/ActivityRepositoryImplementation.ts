import { InjectModel } from '@nestjs/sequelize';
import { ActivityModel } from '../../../models';
import { IActivityRepository } from './ActivityRepositoryInterface';

export class ActivityRepositoryImplementation implements IActivityRepository {
  constructor(
    @InjectModel(ActivityModel) private activityModel: typeof ActivityModel,
  ) {}
  findAllByCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<ActivityModel[]> {
    return this.activityModel.findAll({
      limit: limit,
      offset: offset,
      where: {
        ...condition,
        is_deleted: false,
      },
      order: [['created_at', 'desc']],
    });
  }
  create(payload: any): Promise<ActivityModel> {
    return this.activityModel.create(payload);
  }
  findById(id: string): Promise<ActivityModel> {
    return this.activityModel.findByPk(id);
  }
  update(id: string, payload: any): Promise<[number, ActivityModel[]]> {
    return this.activityModel.update(payload, {
      where: {
        id: id,
      },
      returning: true,
    });
  }
  countByCondition(condition: any): Promise<number> {
    return this.activityModel.count({
      where: {
        ...condition,
        is_deleted: false,
      },
    });
  }
}
