import { CreateAppNotificationDto, CreateNotificationDto, FilterAppNotificationDto, FilterNotificationDto, UpdateNotificationDto } from "../dto/NotificationDto";
import { NotificationModel } from "../../../models";
import {NotificationSegmentEnum, NotificationTypeEnum} from "../enum/NotificationEnum";
import {CreateIndividualNotification} from "../types/NotificationTypes";
export interface INotificationService {
    getNotificationList(payload: FilterNotificationDto): Promise<NotificationModel[]>;
    getNotificationDetail(id: string): Promise<NotificationModel>
    createNotification(payload: CreateNotificationDto): Promise<NotificationModel>
    updateNotification(id: string, payload: UpdateNotificationDto): Promise<NotificationModel>
    countNotificationByCondition(condition: any): Promise<number>
    createAppNotification(payload: CreateAppNotificationDto): Promise<NotificationModel>
    getAppNotificationList(payload: FilterAppNotificationDto): Promise<NotificationModel[]>
    countAppNotificationByCondition(condition: any): Promise<number>
    createUserInAppAndPushNotification(payload: CreateIndividualNotification): Promise<void>;
}
export const INotificationService = Symbol('INotificationService');
