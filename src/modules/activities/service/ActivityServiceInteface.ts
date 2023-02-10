import { ActivityModel } from '../../../models';
import {
  CreateActivityDto,
  FilterActivityDto,
  UpdateActivityDto,
} from '../dto/ActivityDto';

export interface IActivityService {
  getActivityList(payload: FilterActivityDto): Promise<ActivityModel[]>;
  getActivityDetail(id: string): Promise<ActivityModel>;
  createActivity(payload: CreateActivityDto): Promise<ActivityModel>;
  updateActivity(
    id: string,
    payload: UpdateActivityDto,
  ): Promise<ActivityModel>;
  countActivityByCondition(condition: any): Promise<number>;
}

export const IActivityService = Symbol('IActivityService');
