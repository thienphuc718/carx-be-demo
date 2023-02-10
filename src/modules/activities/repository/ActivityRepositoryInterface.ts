import { ActivityModel } from '../../../models/Activities';

export interface IActivityRepository {
  findAllByCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<ActivityModel[]>;
  create(payload: any): Promise<ActivityModel>;
  findById(id: string): Promise<ActivityModel>;
  update(id: string, payload: any): Promise<[number, ActivityModel[]]>;
  countByCondition(condition: any): Promise<number>;
}

export const IActivityRepository = Symbol('IActivityRepository');
