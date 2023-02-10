import { NotificationSegmentEnum, NotificationTypeEnum } from "../enum/NotificationEnum";

export type NotificationDataType = {
  order_id?: string,
  booing_id?: string,
  notification_id?: string,
  message_id?: string,
  flash_buy_request_id?: string,
  conversation_id?: string,
  onsite_rescue_request_id?: string,
  trailer_rescue_request_id?: string,
  trailer_rescue_response_id?: string,
  onsite_rescue_response_id?: string,
  post_id?: string,
} & Record<string, any>;

export type CreateIndividualNotification = {
  userId: string,
  message: string,
  heading: string,
  targetGroup: NotificationSegmentEnum,
  data: NotificationDataType,
  type: NotificationTypeEnum,
  image?: string,
}