import { Inject } from '@nestjs/common';
import { ActivityModel } from '../../../models';
import {
  FilterActivityDto,
  CreateActivityDto,
  UpdateActivityDto,
} from '../dto/ActivityDto';
import { IActivityRepository } from '../repository/ActivityRepositoryInterface';
import { IActivityService } from './ActivityServiceInteface';
import { v4 as uuidv4 } from 'uuid';

export class ActivityServiceImplementation implements IActivityService {
  constructor(
    @Inject(IActivityRepository)
    private activityRepository: IActivityRepository,
  ) {}

  async getActivityList(payload: FilterActivityDto): Promise<ActivityModel[]> {
    try {
      const { limit, page, ...rest } = payload;
      const activities = await this.activityRepository.findAllByCondition(
        limit,
        (page - 1) * limit,
        rest,
      );
      return activities;
    } catch (error) {
      throw error;
    }
  }
  getActivityDetail(id: string): Promise<ActivityModel> {
    return this.activityRepository.findById(id);
  }
  async createActivity(payload: CreateActivityDto): Promise<ActivityModel> {
    try {
      const params = {
        id: uuidv4(),
        ...payload,
      }
      const createdActivity = await this.activityRepository.create(params);
      return createdActivity;
    } catch (error) {
      throw error;
    }
  }

  async updateActivity(
    id: string,
    payload: UpdateActivityDto,
  ): Promise<ActivityModel> {
    try {
      const [nModified, activities] = await this.activityRepository.update(
        id,
        payload,
      );
      if (!nModified) {
        throw new Error('Cannot update activity');
      }
      return activities[0];
    } catch (error) {
      throw error;
    }
  }

  countActivityByCondition(condition: any): Promise<number> {
    const queryCondition = this.buildSearchQueryCondition(condition);
    return this.activityRepository.countByCondition(queryCondition);
  }

  // TODO: push to helper
  buildSearchQueryCondition(condition: Record<string, any>) {
    let queryCondition = {
      ...condition,
    };
    const removeKeys = ['limit', 'page'];
    for (const key of Object.keys(queryCondition)) {
      for (const value of removeKeys) {
        if (key === value) {
          delete queryCondition[key];
        }
      }
    }
    return queryCondition;
  }
}
