import { NotificationModel } from '../../../models';

export interface INotificationRepository {
  findAllWithCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<NotificationModel[]>;
  findById(id: string): Promise<NotificationModel>;
  create(payload: any): Promise<NotificationModel>;
  update(id: string, payload: any): Promise<[number, NotificationModel[]]>;
  count(condition: any): Promise<number>;
}

export const INotificationRepository = Symbol('INotificationRepository');
