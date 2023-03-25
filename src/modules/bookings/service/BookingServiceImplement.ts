import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {BookingModel} from '../../../models/Bookings';
import {ICustomerService} from '../../customers/service/customer/CustomerServiceInterface';
import {IOrderService} from '../../orders/service/order/OrderServiceInterface';
import {
  BookingPayloadDto,
  FilterListBookingDto,
  GetCountBookingByEachStatusDto,
  ServiceItemPayloadDto,
  UpdateServiceItemPriceDto,
} from '../dto/BookingDto';
import {IBookingRepository} from '../repository/BookingRepositoryInterface';
import {IBookingService} from './BookingServiceInterface';
import {TransportationMethodEnum} from '../../orders/enum/TransportationEnum';
import {PaymentMethodEnum} from '../../orders/enum/PaymentEnum';
import {OrderStatusEnum, OrderTypeEnum} from '../../orders/enum/OrderEnum';
import {OnsiteRescueRequestStatusEnum} from '../../onsite-rescues/enum/OnsiteRescueRequestEnum';
import {UpdateOrderItemsPriceDto} from '../../orders/dto/requests/OrderRequestDto';
import {IOrderItemService} from '../../orders/service/order-item/OrderItemServiceInterface';
import {
  IOnsiteRescueRequestService
} from '../../onsite-rescues/service/onsite-rescue-requests/OnsiteRescueRequestServiceInterface';
import {OrderItemPayloadDto} from '../../orders/dto/requests/OrderItemRequestDto';
import {BookingActionEnum, BookingStatusEnum} from '../enum/BookingEnum';
import {AppGateway} from '../../../gateway/AppGateway';
import {IAgentService} from '../../agents/service/AgentServiceInterface';
import {INotificationService} from '../../notifications/service/NotificationServiceInterface';
import {NotificationSegmentEnum, NotificationTypeEnum} from '../../notifications/enum/NotificationEnum';
import {IForbiddenKeywordService} from '../../forbidden-keywords/service/ForbiddenKeywordServiceInterface';
import {
  ITrailerRescueRequestService
} from '../../trailer-rescues/service/trailer-rescue-requests/TrailerRescueRequestServiceInterface';
import {
  TrailerRescueRequestFormerStatusEnum,
  TrailerRescueRequestLaterStatusEnum
} from '../../trailer-rescues/enum/TrailerRescueRequestEnum';

@Injectable()
export class BookingServiceImplementation implements IBookingService {
  constructor(
    @Inject(IBookingRepository)
    private bookingRepository: IBookingRepository,
    @Inject(IOrderService)
    private orderService: IOrderService,
    @Inject(IOrderItemService)
    private orderItemService: IOrderItemService,
    @Inject(ICustomerService)
    private customerService: ICustomerService,
    @Inject(IOnsiteRescueRequestService)
    private onsiteRescueRequestService: IOnsiteRescueRequestService,
    @Inject(AppGateway) private appGateway: AppGateway,
    @Inject(IAgentService) private agentService: IAgentService,
    @Inject(INotificationService)
    private notificationService: INotificationService,
    @Inject(forwardRef(() => IForbiddenKeywordService))
    private forbiddenKeywordService: IForbiddenKeywordService,
    @Inject(forwardRef(() => ITrailerRescueRequestService))
    private trailerRescueRequestService: ITrailerRescueRequestService,
  ) {}

  async getBookingList(payload: FilterListBookingDto): Promise<BookingModel[]> {
    try {
      const { limit, page, ...rest } = payload;
      const bookings = await this.bookingRepository.findAllByCondition(
        limit,
        page,
        rest,
      );
      return bookings;
    } catch (error) {
      throw error;
    }
  }

  getBookingDetail(id: string): Promise<BookingModel> {
    try {
      return this.bookingRepository.findById(id);
    } catch (error) {
      throw error;
    }
  }

  processServiceItemData(serviceItems: ServiceItemPayloadDto[]): any[] {
    let result = [];
    for (let i = 0; i < serviceItems.length; i++) {
      result.push({
        product_id: serviceItems[i].product_id,
        product_sku: serviceItems[i].service_code,
        quantity: 1,
      });
    }
    return result;
  }

  async createBooking(
    payload: BookingPayloadDto,
    userId: string,
  ): Promise<BookingModel> {
    try {
      const { service_items } = payload;
      // check if this user have customer account yet
      const customer = await this.customerService.getCustomerDetailByCondition(
        { user_id: userId },
        'public',
      );
      if (!customer) {
        throw new Error('Customer not found');
      }
      const agent = await this.agentService.getAgentDetails(payload.agent_id);
      if (!agent) {
        throw new Error('Agent not found');
      }
      const checkForbiddenKeyword = await this.forbiddenKeywordService.checkKeywordExist(payload.note);
      if (checkForbiddenKeyword) {
        let data = {
          message: 'Forbidden keywords exists',
          value: checkForbiddenKeyword,
          code: 'FORBIDDEN_KEYWORD_ERROR'
        }
        throw data;
      }
      const customer_id = customer.id;
      const orderItems = this.processServiceItemData(service_items);
      const order = await this.orderService.createOrder(
        {
          order_items: orderItems,
          agent_id: payload.agent_id,
          transportation_method: TransportationMethodEnum.AT_AGENT_GARAGE,
          payment_method: PaymentMethodEnum.CASH,
          type: OrderTypeEnum.BOOKING,
        },
        userId,
        true,
      );
      if (order) {
        const createdBooking = await this.bookingRepository.create({
          order_id: order.id,
          booking_date: payload.booking_date,
          booking_hour: payload.booking_hour,
          customer_id: customer_id,
          agent_id: payload.agent_id,
          note: payload.note,
        });
        this.appGateway.server.emit(`ROOM_${createdBooking.agent_id}`, {
          action: BookingActionEnum.BOOK_SERVICE,
          data: {
            booking_id: createdBooking.id,
          },
          channel: 'CARX_BOOKING',
        });

        // SEND NOTIFICATION
        await this.notificationService.createUserInAppAndPushNotification(
          {
            userId: agent.user_id,
            message: 'Bạn vừa nhận được một đơn hàng dịch vụ mới',
            heading: `Đơn hàng dịch vụ #${createdBooking.booking_no}`,
            targetGroup: NotificationSegmentEnum.AGENT,
            data: { booking_id: createdBooking.id },
            type: NotificationTypeEnum.CUSTOMER_CREATE_BOOKING,
            image: customer.avatar ?? null,
          }
        );
        return this.getBookingDetail(createdBooking.id);
      } else {
        throw new Error('failed to create booking');
      }
    } catch (error) {
      throw error;
    }
  }

  async updateBooking(
    id: string,
    payload: BookingPayloadDto,
  ): Promise<BookingModel> {
    try {
      if (
        (payload.status && payload.status === BookingStatusEnum.CANCELLED) ||
        payload.status === BookingStatusEnum.REPORTED
      ) {
        throw new Error(
          'Cannot cancel or report booking. Please use cancel or report API instead.',
        );
      }
      const [nModified, bookings] = await this.bookingRepository.update(
        id,
        payload,
      );
      if (!nModified) {
        throw new Error(`Cannot update booking ${id}`);
      }
      const updatedBooking = bookings[0];
      const customer = await this.customerService.getCustomerDetail(updatedBooking.customer_id, 'public');
      const agent = await this.agentService.getAgentDetails(updatedBooking.agent_id);
      if (payload.invoice_image || payload.vat_image) {
        const order = await this.orderService.getOrderDetail(updatedBooking.order_id);
        order.invoice_image = payload.invoice_image ? payload.invoice_image : order.invoice_image;
        order.vat_image = payload.vat_image ? payload.vat_image : order.vat_image;
        await order.save();
      }
      if (payload.online_payment_attempt >= 3) {
        await this.notificationService.createUserInAppAndPushNotification(
          {
            userId: customer.user_id,
            message: `Đơn hàng dịch vụ #${updatedBooking.booking_no} thanh toán thất bại`,
            heading: `Đơn hàng dịch vụ #${updatedBooking.booking_no}`,
            targetGroup: NotificationSegmentEnum.CUSTOMER,
            data: { booking_id: updatedBooking.id },
            type: NotificationTypeEnum.PAYMENT_FAILED,
            image: agent.avatar ?? null,
          }
        );
        this.appGateway.server.emit('BOOKING_PAYMENT_FAILED', {
          action: 'BOOKING_PAYMENT_FAILED',
          data: {
            booking_id: updatedBooking.id,
          },
          channel: 'CARX_BOOKING',
        });
      }
      if (payload.status) {
        switch (payload.status) {
          case BookingStatusEnum.CONFIRMED:
            await this.notificationService.createUserInAppAndPushNotification(
              {
                userId: customer.user_id,
                message: `Đơn hàng dịch vụ #${updatedBooking.booking_no}`,
                heading: `Đại lý ${agent.name} đã xác nhận đơn hàng dịch vụ #${updatedBooking.booking_no}`,
                targetGroup: NotificationSegmentEnum.CUSTOMER,
                data: { booking_id: updatedBooking.id },
                type: NotificationTypeEnum.AGENT_CONFIRM_BOOKING,
                image: agent.avatar ?? null,
              }
            );
            this.appGateway.server.emit(`ROOM_${updatedBooking.customer_id}`, {
              action: BookingActionEnum.CONFIRM_SERVICE,
              data: {
                booking_id: updatedBooking.id,
              },
              channel: 'CARX_BOOKING',
            });
            break;
          case BookingStatusEnum.QUOTATION_SENT:
            await this.notificationService.createUserInAppAndPushNotification(
              {
                userId: customer.user_id,
                message: `Đại lý ${agent.name} đã gửi báo giá cho đơn hàng dịch vụ #${updatedBooking.booking_no}`,
                heading: `Đơn hàng dịch vụ #${updatedBooking.booking_no}`,
                targetGroup: NotificationSegmentEnum.CUSTOMER,
                data: { booking_id: updatedBooking.id },
                type: NotificationTypeEnum.AGENT_SEND_QUOTATION,
                image: agent.avatar ?? null,
              }
            );
            this.appGateway.server.emit(`ROOM_${updatedBooking.customer_id}`, {
              action: BookingActionEnum.SEND_SERVICE_QUOTATION,
              data: {
                booking_id: updatedBooking.id,
              },
              channel: 'CARX_BOOKING',
            });
            break;
          case BookingStatusEnum.QUOTATION_CONFIRMED:
            await this.notificationService.createUserInAppAndPushNotification(
              {
                userId: agent.user_id,
                message: `Khách hàng đã xác nhận báo giá đơn hàng dịch vụ #${updatedBooking.booking_no}`,
                heading: `Đơn hàng dịch vụ #${updatedBooking.booking_no}`,
                targetGroup: NotificationSegmentEnum.AGENT,
                data: { booking_id: updatedBooking.id },
                type: NotificationTypeEnum.CUSTOMER_CONFIRM_QUOTATION,
                image: customer.avatar ?? null,
              }
            );
            this.appGateway.server.emit(`ROOM_${updatedBooking.agent_id}`, {
              action: BookingActionEnum.CONFIRM_SERVICE_QUOTATION,
              data: {
                booking_id: updatedBooking.id,
              },
              channel: 'CARX_BOOKING',
            });
            break;
          case BookingStatusEnum.PROCESSING:
            // await this.orderService.updateOrder(updatedBooking.order_id, {
            //   status: OrderStatusEnum.PROCESSING
            // });
            await this.notificationService.createUserInAppAndPushNotification(
              {
                userId: customer.user_id,
                message: `Đơn hàng dịch vụ #${updatedBooking.booking_no} của bạn đang được thực hiện`,
                heading: `Đơn hàng dịch vụ #${updatedBooking.booking_no}`,
                targetGroup: NotificationSegmentEnum.CUSTOMER,
                data: { booking_id: updatedBooking.id },
                type: NotificationTypeEnum.AGENT_CONFIRM_BOOKING,
                image: agent.avatar ?? null,
              }
            );
            this.appGateway.server.emit(`ROOM_${updatedBooking.customer_id}`, {
              action: BookingActionEnum.PROCESSING_SERVICE,
              data: {
                booking_id: updatedBooking.id,
              },
              channel: 'CARX_BOOKING',
            });
            break;
          case BookingStatusEnum.WAITING_FOR_PAYMENT:
            await this.notificationService.createUserInAppAndPushNotification(
              {
                userId: customer.user_id,
                message: `Đơn hàng dịch vụ #${updatedBooking.booking_no} của bạn đã được hoàn thành, đang chờ thanh toán`,
                heading: `Đơn hàng dịch vụ #${updatedBooking.booking_no}`,
                targetGroup: NotificationSegmentEnum.CUSTOMER,
                data: { booking_id: updatedBooking.id },
                type: NotificationTypeEnum.AGENT_SEND_QUOTATION,
                image: agent.avatar ?? null,
              }
            );
            this.appGateway.server.emit(`ROOM_${updatedBooking.customer_id}`, {
              action: BookingActionEnum.COMPLETE_SERVICE,
              data: {
                booking_id: updatedBooking.id,
              },
              channel: 'CARX_BOOKING',
            });
            break;
          case BookingStatusEnum.COMPLETED:
            const order = await this.orderService.getOrderDetail(updatedBooking.order_id);
            if (!order) {
              throw new Error('Order not found');
            }
            await this.orderService.updateOrder(order.id, {
              status: OrderStatusEnum.COMPLETED,
              value: order.value,
            });
            this.appGateway.server.emit(`ROOM_${updatedBooking.agent_id}`, {
              action: BookingActionEnum.COMPLETE_PAYMENT_SERVICE,
              data: {
                booking_id: updatedBooking.id,
              },
              channel: 'CARX_BOOKING',
            });
            const rescue =
              await this.onsiteRescueRequestService.getOnsiteRescueRequestByCondition(
                {
                  booking_id: updatedBooking.id,
                },
              );
            if (rescue) {
              await this.onsiteRescueRequestService.updateOnsiteRescueRequest(
                rescue.id,
                {
                  status: OnsiteRescueRequestStatusEnum.COMPLETED,
                },
              );
            }
            const formerRescueRequest =
              await this.trailerRescueRequestService.getTrailerRescueRequestByCondition(
                {
                  former_booking_id: updatedBooking.id,
                },
              );
            if (formerRescueRequest) {
              await this.trailerRescueRequestService.updateTrailerRescueRequest(
                formerRescueRequest.id,
                {
                  former_status: TrailerRescueRequestFormerStatusEnum.COMPLETED,
                },
              );
            }
            const laterRescueRequest =
              await this.trailerRescueRequestService.getTrailerRescueRequestByCondition(
                {
                  later_booking_id: updatedBooking.id,
                },
              );
            if (laterRescueRequest) {
              await this.trailerRescueRequestService.updateTrailerRescueRequest(
                laterRescueRequest.id,
                { later_status: TrailerRescueRequestLaterStatusEnum.COMPLETED },
              );
            }
            break;
          default:
            console.log(payload.status);
            break;
        }
      }
      // return updatedBooking;
      return this.getBookingDetail(updatedBooking.id);
    } catch (error) {
      throw error;
    }
  }

  async updateServiceItems(
    bookingId: string,
    serviceItems: UpdateServiceItemPriceDto[],
  ): Promise<BookingModel> {
    try {
      const booking = await this.getBookingDetail(bookingId);
      const order = await this.orderService.getOrderDetail(booking.order_id);
      if (!booking || !order) {
        throw new Error('Booking not found');
      }
      if (
        [OrderStatusEnum.CANCELLED, OrderStatusEnum.COMPLETED].includes(
          order.status,
        )
      ) {
        throw new Error(`Cannot update order ${order.status}`);
      }
      const orderItems: UpdateOrderItemsPriceDto[] = serviceItems.map(
        (serviceItem) => ({
          order_item_id: serviceItem.service_item_id,
          price: serviceItem.price,
          product_id: serviceItem.product_id,
        }),
      );
      await this.orderService.updateOrderItems(booking.order_id, orderItems);
      return this.getBookingDetail(bookingId);
    } catch (error) {
      throw error;
    }
  }

  async createIncurringItems(
    bookingId: string,
    payload: OrderItemPayloadDto[],
  ): Promise<any> {
    try {
      const booking = await this.getBookingDetail(bookingId);
      if (!booking) {
        throw new Error('Booking not found');
      }
      if (
        [OrderStatusEnum.CANCELLED, OrderStatusEnum.COMPLETED].includes(
          booking.order.status,
        )
      ) {
        throw new Error(`Cannot update order ${booking.order.status}`);
      }
      const incurringItems = await this.orderService.processOrderItemData(
        payload.map((item) => ({
          product_sku: item.product_sku,
          order_id: booking.order_id,
          quantity: item.quantity,
          product_id: item.product_id,
          is_incurring: true,
        })),
      );
      await Promise.all(
        incurringItems.map((item) =>
          this.orderItemService.createOrderItem(item),
        ),
      );
      const order = await this.orderService.getOrderDetail(booking.order_id);
      const orderItems = order.items;
      const newOrderValue = orderItems.reduce(
        (value, orderItem) => value + orderItem.price * orderItem.quantity,
        0,
      );
      await this.orderService.updateOrder(booking.order_id, {
        initial_value: newOrderValue,
        value: newOrderValue,
      });
      return this.getBookingDetail(bookingId);
    } catch (error) {
      throw error;
    }
  }

  async deleteBooking(id: string): Promise<void> {
    try {
      const booking = await this.getBookingDetail(id);
      if (!booking) {
        throw new Error('Booking not found');
      }
      await this.orderService.deleteOrder(booking.order_id);
      this.bookingRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }

  async cancelBooking(id: string, reason: string, userId: string): Promise<BookingModel> {
    try {
      const booking = await this.getBookingDetail(id);
      const order = await this.orderService.getOrderDetail(booking.order_id);
      if (!booking || !order) {
        throw new Error('Booking not found');
      }
      // get later booking trailer rescue request
      let laterBookingTrailerRescueRequest =
        await this.trailerRescueRequestService.getTrailerRescueRequestByCondition({
          later_booking_id: booking.id
        });
      if (
        laterBookingTrailerRescueRequest &&
        laterBookingTrailerRescueRequest.former_status === TrailerRescueRequestFormerStatusEnum.PROCESSING &&
        laterBookingTrailerRescueRequest.later_status === TrailerRescueRequestLaterStatusEnum.PROCESSING
      ) {
        throw new Error('Cannot cancel booking while processing trailer rescue request');
      } else {
        // get former booking trailer rescue request
        const formerBookingTrailerRescueRequest =
          await this.trailerRescueRequestService.getTrailerRescueRequestByCondition({
            former_booking_id: booking.id,
          });
        if (
          formerBookingTrailerRescueRequest &&
          formerBookingTrailerRescueRequest.former_status === TrailerRescueRequestFormerStatusEnum.PROCESSING
        ) {
          await formerBookingTrailerRescueRequest.update({
            former_status: TrailerRescueRequestFormerStatusEnum.CANCELLED
          });
        }
      }
      await this.orderService.cancelOrder(order.id, reason, userId);
      booking.status = BookingStatusEnum.CANCELLED;
      await booking.save();
      this.appGateway.server.emit(`ROOM_${booking.agent_id}`, {
        action: BookingActionEnum.CANCEL_SERVICE,
        data: {
          booking_id: booking.id,
        },
        channel: 'CARX_BOOKING',
      });
      return this.getBookingDetail(booking.id);
    } catch (error) {
      console.log(error)
      throw error;
    }
  }

  async reportBooking(id: string, reason: string): Promise<BookingModel> {
    try {
      const booking = await this.getBookingDetail(id);
      const order = await this.orderService.getOrderDetail(booking.order_id);
      if (!booking || !order) {
        throw new Error('Booking not found');
      }
      await this.orderService.reportOrder(order.id, reason);
      booking.status = BookingStatusEnum.REPORTED;
      booking.report_reason = reason;
      await booking.save();
      this.appGateway.server.emit(`ROOM_${booking.agent_id}`, {
        action: BookingActionEnum.REPORTED,
        data: {
          booking_id: booking.id,
        },
        channel: 'CARX_BOOKING',
      });
      return booking;
    } catch (error) {
      throw error;
    }
  }

  countBookingByCondition(condition: any): Promise<number> {
    const { limit, page, ...rest } = condition;
    return this.bookingRepository.count(rest);
  }

  async totalBookingByEachStatus(
    payload: GetCountBookingByEachStatusDto,
  ): Promise<any> {
    const { agent_id, customer_id } = payload;
    let condition = {};
    if (!agent_id && !customer_id) {
      throw new Error('Missing arguments');
    } else if (agent_id && customer_id) {
      throw new Error('Cannot have agent_id and customer_id at the same time');
    } else if (agent_id) {
      const agent = await this.agentService.getAgentDetails(agent_id);
      if (!agent) {
        throw new Error('Agent not found')
      }
      condition = {
        agent_id: agent.id,
      };
    } else if (customer_id) {
      const customer = await this.customerService.getCustomerDetail(customer_id, 'public');
      if (!customer) {
        throw new Error('Customer not found');
      }
      condition = {
        customer_id: customer.id,
      };
    }

    const numberOfCreatedBooking = await this.countBookingByCondition({
      ...condition,
      status: BookingStatusEnum.CREATED,
    });

    const numberOfConfirmedBooking = await this.countBookingByCondition({
      ...condition,
      status: BookingStatusEnum.CONFIRMED,
    });

    const numberOfSentQuotationBooking = await this.countBookingByCondition({
      ...condition,
      status: BookingStatusEnum.QUOTATION_SENT,
    });

    const numberOfConfirmedQuotationBooking =
      await this.countBookingByCondition({
        ...condition,
        status: BookingStatusEnum.QUOTATION_CONFIRMED,
      });

    const numberOfProcessingBooking = await this.countBookingByCondition({
      ...condition,
      status: BookingStatusEnum.PROCESSING,
    });

    const numberOfCancelledBooking = await this.countBookingByCondition({
      ...condition,
      status: BookingStatusEnum.CANCELLED,
    });

    const numberOfReportedBooking = await this.countBookingByCondition({
      ...condition,
      status: BookingStatusEnum.REPORTED,
    });

    const numberOfCompletedBooking = await this.countBookingByCondition({
      ...condition,
      status: BookingStatusEnum.COMPLETED,
    });

    const data = {
      created_bookings: numberOfCreatedBooking,
      confirmed_bookings: numberOfConfirmedBooking,
      quotation_sent_bookings: numberOfSentQuotationBooking,
      quotation_confirmed_bookings: numberOfConfirmedQuotationBooking,
      processing_bookings: numberOfProcessingBooking,
      canceled_bookings: numberOfCancelledBooking,
      reported_bookings: numberOfReportedBooking,
      completed_bookings: numberOfCompletedBooking,
    };
    return data;
  }
}
