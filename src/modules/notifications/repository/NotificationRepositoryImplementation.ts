import { InjectModel } from '@nestjs/sequelize';
import { NotificationModel } from '../../../models';
import { INotificationRepository } from './NotificationRepositoryInterface';

export class NotificationRepositoryImplementation
  implements INotificationRepository
{
  constructor(
    @InjectModel(NotificationModel)
    private notificationModel: typeof NotificationModel,
  ) {}
  findAllWithCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<NotificationModel[]> {
    return this.notificationModel.findAll({
      limit: limit,
      offset: offset,
      where: {
        ...condition,
        is_deleted: false,
      },
      attributes: {
        exclude: ['vendor_response']
      },
      order: [['created_at', 'desc']],
    });
  }
  findById(id: string): Promise<NotificationModel> {
    return this.notificationModel.findByPk(id, {
      attributes: {
        exclude: ['vendor_response']
      },
    });
  }
  create(payload: any): Promise<NotificationModel> {
    return this.notificationModel.create(payload);
  }

  update(id: string, payload: any): Promise<[number, NotificationModel[]]> {
    return this.notificationModel.update(payload, {
      where: {
        id: id,
      },
      returning: true,
    });
  }
  count(condition: any): Promise<number> {
    return this.notificationModel.count({
      where: {
        ...condition,
        is_deleted: false,
      }
    });
  }
}
