import {forwardRef, Inject} from '@nestjs/common';
import {IOrderRepository} from '../../repository/order/OrderRepositoryInterface';
import {IOrderService} from './OrderServiceInterface';
import {IOrderItemService} from '../order-item/OrderItemServiceInterface';
import {ICustomerService} from '../../../customers/service/customer/CustomerServiceInterface';
import {IProductVariantService} from '../../../products/service/product-variants/ProductVariantServiceInterface';
import {CreateOrderItemPayloadDto, UpdateOrderItemPayloadDto} from '../../dto/requests/OrderItemRequestDto';
import {
  FilterOrderDto,
  GetCountOrderByEachStatusDto,
  OrderInsuranceType,
  OrderPayloadDto,
  UpdateOrderItemsPriceDto,
} from '../../dto/requests/OrderRequestDto';
import {PaymentMethod, TransportationMethod} from '../../../../constants';
import {CustomerModel, InsuranceProductModel, OrderItemModel, OrderModel,} from '../../../../models';
import {
  InsuranceInfoCertificateTypeEnum,
  OrderEventActionEnum,
  OrderStatusEnum,
  OrderTypeEnum,
} from '../../enum/OrderEnum';
import {Op} from 'sequelize';
import {ISystemConfigurationService} from '../../../system-configurations/service/SystemConfigurationServiceInterface';
import {IPromotionService} from '../../../promotions/service/promotion/PromotionServiceInterface';
import {PromotionDiscountTypeEnum} from '../../../promotions/enum/PromotionEnum';
import {IAgentService} from '../../../agents/service/AgentServiceInterface';
import {INotificationService} from '../../../notifications/service/NotificationServiceInterface';
import {NotificationSegmentEnum, NotificationTypeEnum,} from '../../../notifications/enum/NotificationEnum';
import {IPushNotificationService} from '../../../push-notifications/service/PushNotificationInterface';
import {AppGateway} from '../../../../gateway/AppGateway';
import {ICurlService} from '../../../curl/service/CurlServiceInterface';
import {CathayInsuranceRequestPayloadType} from '../../types/OrderTypes';
import {
  InsuranceProductServiceInterface
} from '../../../products/service/insurance-products/InsuranceProductServiceInterface';
import {add, endOfDay, format, parse, startOfDay} from 'date-fns';
import {validateEmail} from '../../../../helpers/emailHelper';
import {vi} from 'date-fns/locale';
import {generatePassword} from '../../../../helpers/passwordHelper';
import {
  InsuranceContractServiceInterface
} from '../../../insurance-contracts/service/InsuranceContractServiceInterface';
import {PaymentMethodEnum} from '../../enum/PaymentEnum';
import {sumBy} from "lodash";

export class OrderServiceImplementation implements IOrderService {
  constructor(
    @Inject(IOrderRepository)
    private orderRepository: IOrderRepository,
    @Inject(IOrderItemService)
    private orderItemService: IOrderItemService,
    @Inject(ICustomerService)
    private customerService: ICustomerService,
    @Inject(IProductVariantService)
    private productVariantService: IProductVariantService,
    @Inject(ISystemConfigurationService)
    private systemConfigurationService: ISystemConfigurationService,
    @Inject(IPromotionService) private promotionService: IPromotionService,
    @Inject(forwardRef(() => IAgentService))
    private agentService: IAgentService,
    @Inject(INotificationService)
    private notificationService: INotificationService,
    @Inject(IPushNotificationService)
    private pushNotificationService: IPushNotificationService,
    @Inject(AppGateway) private appGateway: AppGateway,
    @Inject(ICurlService) private curlService: ICurlService,
    @Inject(forwardRef(() => InsuranceProductServiceInterface))
    private insuranceProductService: InsuranceProductServiceInterface,
    @Inject(InsuranceContractServiceInterface)
    private insuranceContractService: InsuranceContractServiceInterface,
  ) {}

  async getOrderList(payload: FilterOrderDto): Promise<OrderModel[]> {
    try {
      const { limit, page, ...rest } = payload;
      const condition = this.buildSearchQueryCondition({...rest, type: OrderTypeEnum.PHYSICAL_PURCHASED});
      const orders = await this.orderRepository.findAllByCondition(
        limit,
        (page - 1) * limit,
        condition,
      );
      return orders;
    } catch (error) {
      throw error;
    }
  }

  checkPaymentMethod(paymentMethod: string): boolean {
    let paymentProviders = new PaymentMethod();
    for (let i = 0; i < paymentProviders.methods.length; i++) {
      if (paymentProviders.methods[i].code == paymentMethod) return true;
    }
    return false;
  }

  checkTransportationMethod(transportationMethod: string): boolean {
    let transportationProviders = new TransportationMethod();
    for (let i = 0; i < transportationProviders.methods.length; i++) {
      if (transportationProviders.methods[i].code == transportationMethod) {
        return true;
      }
    }
    return false;
  }

  getOrderDetail(id: string): Promise<OrderModel> {
    try {
      return this.orderRepository.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async processOrderItemData(orderItems: any[]): Promise<any[]> {
    if (!orderItems || orderItems.length === 0) {
      throw new Error('order items not found');
    }
    let orderSkus = orderItems.map((orderItem) => orderItem.product_sku);
    if (orderSkus) {
      let products = await this.productVariantService.getListFromListSku(
        orderSkus,
      );
      for (let i = 0; i < orderItems.length; i++) {
        let ok = false;
        for (let j = 0; j < products.length; j++) {
          if (products[j].sku == orderItems[i].product_sku) {
            ok = true;
            // set price for this item
            orderItems[i].price = products[j].discount_price
              ? products[j].discount_price
              : products[j].price;
            break;
          }
        }
        if (!ok) {
          throw new Error(`order item ${orderSkus[i]} not found`);
        }
      }
    }
    return orderItems;
  }

  calculateOrderValue(orderItems: any[]): number {
    let sum = 0;
    for (let i = 0; i < orderItems.length; i++) {
      sum += orderItems[i].price * orderItems[i].quantity;
    }
    return sum;
  }

  async createOrder(
    payload: OrderPayloadDto,
    userId: string,
    isBooking?: boolean,
  ): Promise<OrderModel> {
    try {
      const { order_items } = payload;
      if (!this.checkTransportationMethod(payload.transportation_method)) {
        throw new Error('Transportation method does not support yet');
      }
      if (!this.checkPaymentMethod(payload.payment_method)) {
        throw new Error('Payment method does not support yet');
      }
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
      let promotionValueApplied = 0;
      let pointValue = 0;
      let pointUsed = 0;
      let vatValueApplied = 0;
      let distanceValue = 0;
      // check order items condition
      const orderItems = await this.processOrderItemData(order_items);
      if (payload.is_insurance_order) {
        if (!payload.insurance_info) {
          throw new Error('Missing insurance information for insurance order');
        }
        const insuranceProduct =
          await this.insuranceProductService.getInsuranceProductByCondition({
            product_id: order_items[0].product_id,
          });
        if (!insuranceProduct) {
          throw new Error('Insurance product not found');
        }
        if (payload.is_vat_exported && payload.is_vat_exported === true) {
          throw new Error('Cannot apply VAT to insurance order');
        }
        this.validateInsurancePayload(payload.insurance_info, insuranceProduct);
        const insuranceContract =
            await this.insuranceContractService.getInsuranceContractByCondition({ frame_no: payload.insurance_info.frame_no });
        if (insuranceContract) {
          const today = new Date();
          if (today < insuranceContract.end_date) {
            throw new Error('You have already had a contract that has not been expired');
          }
        }
        const isEngineNoValid = await this.insuranceContractService.getInsuranceContractByCondition({ engine_no: payload.insurance_info.engine_no });
        if (isEngineNoValid) {
          const today = new Date();
          if (today < isEngineNoValid.end_date) {
            throw new Error('You have already had a contract that has not been expired');
          }
        }
        if (payload.payment_method !== PaymentMethodEnum.MOMO) {
          throw new Error('Insurance order can only use online payment method');
        }
        // HEALTH CHECK CATHAY SERVER
        try {
          const healthCheckResponseData = await this.curlService.sendGetRequest({
            url: `${process.env.CATHAY_HEALTH_CHECK_URL}`,
            addheaders: {TOKEN: `${process.env.CATHAY_TOKEN}`},
          });
          console.log(healthCheckResponseData);
          console.log(typeof healthCheckResponseData);
          if (
            !healthCheckResponseData ||
            !healthCheckResponseData.data ||
            healthCheckResponseData.data.status !== '200'
          ) {
            throw new Error('Cannot create insurance order, service unavailable')
          }
        } catch (error) {
          console.log(error);
          throw error;
        } finally {
          console.log('HEALTH CHECK CATHAY SERVER');
        }
        payload.insurance_info.carx_contract_number = `CONTRACT_${generatePassword().toUpperCase() + Date.now()}`;
      }
      let initialOrderValue = this.calculateOrderValue(orderItems);
      let processedOrderValue = initialOrderValue;
      // APPLY VAT
      if (payload.is_vat_exported && payload.is_vat_exported === true) {
        const vatValue = await this.applyVAT(initialOrderValue);
        distanceValue += vatValue;
        vatValueApplied = vatValue;
      }
      // APPLY PROMOTION CODE
      if (payload.agent_promotion_code || payload.carx_promotion_code) {
        if (payload.agent_promotion_code && payload.carx_promotion_code) {
          throw new Error('Cannot apply more than one promotion code');
        }
        const promotionValue = await this.applyPromotion(
          initialOrderValue,
          payload.agent_promotion_code || payload.carx_promotion_code,
        );
        distanceValue -= promotionValue;
        promotionValueApplied = promotionValue;
      }
      // APPLY CUSTOMER COIN
      if (payload.is_customer_point_applied) {
        const [nPointUsed, nPointValue] = await this.applyCustomerPoint(
          initialOrderValue,
          customer,
        );
        pointUsed = nPointUsed;
        pointValue = nPointValue;
        distanceValue -= pointValue;
      }
      processedOrderValue += distanceValue;
      const params: Record<string, any> = {
        ...payload,
        customer_id: customer.id,
        initial_value: initialOrderValue,
        value: processedOrderValue,
        promotion_value_applied: promotionValueApplied,
        point_value_applied: pointValue,
        point_used: pointUsed,
        vat_value_applied: vatValueApplied,
        status: payload.is_insurance_order
          ? OrderStatusEnum.PROCESSING
          : OrderStatusEnum.CREATED,
      };
      const createdOrder = await this.orderRepository.create(params);
      // add customer to agent customer list
      await this.customerService.addCustomerAgent(
        customer.id,
        payload.agent_id,
      );
      await Promise.all(
        orderItems.map(async (orderItem) => {
          if (!orderItem.product_id && !orderItem.product_sku) {
            throw new Error('Product id and sku should not be empty');
          }
          const orderItemPayload: CreateOrderItemPayloadDto = {
            order_id: createdOrder.id,
            ...orderItem,
          };
          return this.orderItemService.createOrderItem(orderItemPayload);
        }),
      );
      const newCreatedOrder = await this.orderRepository.findById(
        createdOrder.id,
      );

      // SEND NOTIFICATION
      if (!isBooking) {
        await this.notificationService.createUserInAppAndPushNotification(
          {
            userId: agent.user_id,
            message: 'Bạn vừa nhận được một đơn hàng mới',
            heading: `Đơn hàng #${newCreatedOrder.order_no}`,
            targetGroup: NotificationSegmentEnum.AGENT,
            data: { order_id: createdOrder.id },
            type: NotificationTypeEnum.CUSTOMER_CREATE_ORDER,
            image: customer.avatar ?? null,
          }
        );
        this.appGateway.server.emit(`ROOM_${newCreatedOrder.agent_id}`, {
          action: OrderEventActionEnum.ORDER_CREATED,
          data: {
            order_id: newCreatedOrder.id,
          },
          channel: 'CARX_ORDER',
        });
      }
      return newCreatedOrder;
    } catch (error) {
      throw error;
    }
  }

  async updateOrder(id: string, payload: OrderPayloadDto): Promise<OrderModel> {
    try {
      const { order_items, ...rest } = payload;
      if (
        payload.transportation_method &&
        !this.checkTransportationMethod(payload.transportation_method)
      ) {
        throw new Error('Transportation method does not support yet');
      }
      if (
        payload.payment_method &&
        !this.checkPaymentMethod(payload.payment_method)
      ) {
        throw new Error('Payment method does not support yet');
      }
      if (payload.agent_promotion_code && payload.carx_promotion_code) {
        throw new Error('Cannot apply more than one promotion code');
      }
      const order = await this.getOrderDetail(id);
      const customer = await this.customerService.getCustomerDetail(
        order.customer_id,
        'public',
      );
      const agent = await this.agentService.getAgentDetails(order.agent_id);
      const params: Record<string, any> = {
        ...rest,
        value: rest.value || order.value,
      };
      let distance = 0;

      // PROCESS UPDATING ORDER ITEM
      if (order_items && order_items.length) {
        const orderItems = await this.processOrderItemData(order_items);
        const processOrderItems = await Promise.all(orderItems.map(async (orderItem) => {
          if (!orderItem.product_id && !orderItem.product_sku) {
            throw new Error('Product id and sku should not be empty');
          }
          const existedOrderItem = await this.orderItemService.getOrderItemByCondition({
            order_id: order.id,
            product_id: orderItem.product_id,
            product_sku: orderItem.product_sku,
            // quantity: orderItem.quantity
          });
          if (!existedOrderItem) {
            throw new Error('Item not found');
          }
          const updateOrderItemParam: UpdateOrderItemPayloadDto = {
            price: existedOrderItem.price * orderItem.quantity,
            product_id: orderItem.product_id,
            quantity: orderItem.quantity,
            image: existedOrderItem.image || null,
          }
          return this.orderItemService.updateOrderItem(existedOrderItem.id, updateOrderItemParam)
        }));
        params.value = this.calculateOrderValue(processOrderItems);
      }

      // APPLY VAT
      if (payload.is_vat_exported && payload.is_vat_exported === true) {
        if (order.is_vat_exported) {
          throw new Error('Order already calculated and exported VAT invoice');
        }
        const vatValueApplied = await this.applyVAT(order.initial_value);
        distance += vatValueApplied;
        params.vat_value_applied = vatValueApplied;
      }
      // APPLY PROMOTION CODE
      if (payload.agent_promotion_code || payload.carx_promotion_code) {
        if (order.agent_promotion_code || order.carx_promotion_code) {
          throw new Error('Order already had promotion');
        }
        if (payload.agent_promotion_code && payload.carx_promotion_code) {
          throw new Error('Cannot apply more than one promotion code');
        }
        const promotionValueApplied = await this.applyPromotion(
          order.initial_value,
          payload.agent_promotion_code || payload.carx_promotion_code,
        );
        distance -= promotionValueApplied;
        params.promotion_value_applied = promotionValueApplied;
      }
      if (payload.is_customer_point_applied) {
        if (order.is_customer_point_applied) {
          throw new Error('Customer point has already been applied');
        }
        const [pointUsed, pointValue] = await this.applyCustomerPoint(
          order.value,
          customer,
        );
        params.point_used = pointUsed;
        params.point_value_applied = pointValue;
        distance -= pointValue;
      }
      params.value += distance;
      const updatedOrders: OrderModel[] = await this.orderRepository.update(
        id,
        params,
      );
      const updatedOrder: OrderModel = updatedOrders[0];

      // SEND NOTIFICATION
      if (payload.status) {
        switch (payload.status) {
          case OrderStatusEnum.PROCESSING:
            if (order.booking) {
              await this.notificationService.createUserInAppAndPushNotification(
                {
                  userId: customer.user_id,
                  message: `Đơn hàng dịch vụ #${order.booking.booking_no} của bạn đang được thực hiện`,
                  heading: `Đơn hàng dịch vụ #${order.booking.booking_no}`,
                  targetGroup: NotificationSegmentEnum.CUSTOMER,
                  data: { booking_id: order.booking.id },
                  type: NotificationTypeEnum.AGENT_CONFIRM_BOOKING,
                  image: agent.avatar ?? null,
                }
              );
            } else {
              await this.notificationService.createUserInAppAndPushNotification(
                {
                  userId: customer.user_id,
                  message: `Đơn hàng #${updatedOrder.order_no} của bạn đã được xác nhận`,
                  heading: `Đơn hàng #${updatedOrder.order_no}`,
                  targetGroup: NotificationSegmentEnum.CUSTOMER,
                  data: { order_id: updatedOrder.id },
                  type: NotificationTypeEnum.AGENT_CONFIRM_BOOKING,
                  image: agent.avatar ?? null,
                }
              );
              this.appGateway.server.emit(`ROOM_${updatedOrder.customer_id}`, {
                action: OrderEventActionEnum.ORDER_PROCESSING,
                data: {
                  order_id: updatedOrder.id,
                },
                channel: 'CARX_ORDER',
              });
            }
            break;
          // case OrderStatusEnum.PURCHASED:
          //   await this.notificationService.createNotification({
          //     content: 'Một đơn hàng đã được đặt',
          //     data: {
          //       order_id: updatedOrder.id,
          //     },
          //     type: NotificationTypeEnum.AGENT_CONFIRM_ORDER,
          //     user_id: customer.user_id,
          //   });
          //   break;
          case OrderStatusEnum.CANCELLED:
            break;
          case OrderStatusEnum.DELIVERING:
            await this.notificationService.createUserInAppAndPushNotification(
              {
                userId: customer.user_id,
                message: `Đơn hàng sản phẩm #${updatedOrder.order_no} của bạn đang được vận chuyển`,
                heading: `Đơn hàng #${updatedOrder.order_no}`,
                targetGroup: NotificationSegmentEnum.CUSTOMER,
                data: { order_id: updatedOrder.id },
                type: NotificationTypeEnum.ORDER_DELIVERING,
                image: agent.avatar ?? null,
              }
            );
            this.appGateway.server.emit(`ROOM_${updatedOrder.customer_id}`, {
              action: OrderEventActionEnum.ORDER_DELIVERING,
              data: {
                order_id: updatedOrder.id,
              },
              channel: 'CARX_ORDER',
            });
            break;
          case OrderStatusEnum.REPORTED:
            if (order.booking) {
              await this.notificationService.createUserInAppAndPushNotification(
                {
                  userId: agent.user_id,
                  message: `Đơn hàng dịch vụ #${order.booking.booking_no} đã bị báo cáo bởi khách hảng`,
                  heading: `Đơn hàng dịch vụ #${order.booking.booking_no}`,
                  targetGroup: NotificationSegmentEnum.AGENT,
                  data: { booking_id: order.booking.id },
                  type: NotificationTypeEnum.CUSTOMER_REPORT_BOOKING,
                  image: customer.avatar ?? null,
                }
              );
            } else {
              await this.notificationService.createUserInAppAndPushNotification(
                {
                  userId: agent.user_id,
                  message: `Đơn hàng #${updatedOrder.order_no} đã bị báo cáo bởi khách hàng`,
                  heading: `Đơn hàng #${updatedOrder.order_no}`,
                  targetGroup: NotificationSegmentEnum.AGENT,
                  data: { order_id: updatedOrder.id },
                  type: NotificationTypeEnum.CUSTOMER_REPORT_BOOKING,
                  image: customer.avatar ?? null,
                }
              );
              this.appGateway.server.emit(`ROOM_${updatedOrder.agent_id}`, {
                action: OrderEventActionEnum.ORDER_REPORTED,
                data: {
                  order_id: updatedOrder.id,
                },
                channel: 'CARX_ORDER',
              });
            }
            break;
          case OrderStatusEnum.COMPLETED:
            if (order.booking) {
              await this.notificationService.createUserInAppAndPushNotification(
                {
                  userId: agent.user_id,
                  message: `Đơn hàng dịch vụ #${order.booking.booking_no} đã hoàn thành`,
                  heading: `Đơn hàng dịch vụ #${order.booking.booking_no}`,
                  targetGroup: NotificationSegmentEnum.AGENT,
                  data: { booking_id: order.booking.id },
                  type: NotificationTypeEnum.BOOKING_COMPLETED,
                  image: customer.avatar ?? null,
                }
              );
            } else {
              await this.notificationService.createUserInAppAndPushNotification(
                {
                  userId: agent.user_id,
                  message: `Đơn hàng #${order.order_no} đã hoàn thành`,
                  heading: `Đơn hàng #${order.order_no}`,
                  targetGroup: NotificationSegmentEnum.AGENT,
                  data: { order_id: updatedOrder.id },
                  type: NotificationTypeEnum.ORDER_COMPLETED,
                  image: customer.avatar ?? null,
                }
              );
              this.appGateway.server.emit(`ROOM_${updatedOrder.agent_id}`, {
                action: OrderEventActionEnum.ORDER_COMPLETED,
                data: {
                  order_id: updatedOrder.id,
                },
                channel: 'CARX_ORDER',
              });
            }
            // if (order.is_insurance_order && order.insurance_info) {
            //   await this.sendDataToInsuranceCompany(order);
            // }
            await this.calculateCustomerPoint(updatedOrder.value, customer);
            break;
          default:
            console.log('Update order');
        }
      }
      // TODO: refactor with pub/sub system implementation
      return updatedOrder;
    } catch (error) {
      throw error;
    }
  }

  async updateOrderItems(
    orderId: string,
    orderItems: UpdateOrderItemsPriceDto[],
  ): Promise<OrderModel> {
    try {
      await Promise.all(
        orderItems.map((orderItem) =>
          this.orderItemService.updateOrderItem(orderItem.order_item_id, {
            price: orderItem.price,
            product_id: orderItem.product_id,
          }),
        ),
      );
      const order = await this.getOrderDetail(orderId);
      const order_details = JSON.parse(JSON.stringify(order));
      const { items: order_items } = order_details;
      const newOrderValue = order_items.reduce(
        (value: number, orderItem: OrderItemModel) =>
          value + orderItem.price * orderItem.quantity,
        0,
      );
      await this.updateOrder(orderId, {
        value: newOrderValue,
        initial_value: newOrderValue,
      });
      return this.getOrderDetail(orderId);
    } catch (error) {
      throw error;
    }
  }

  async deleteOrder(id: string): Promise<void> {
    try {
      const order = await this.getOrderDetail(id);
      if (!order) {
        throw new Error('Order not found');
      }
      this.orderRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }

  async cancelOrder(
    id: string,
    cancel_reason: string,
    userId: string,
  ): Promise<OrderModel> {
    try {
      const order = await this.getOrderDetail(id);
      const agent = await this.agentService.getAgentDetails(order.agent_id);
      const customer = await this.customerService.getCustomerDetail(
        order.customer_id,
        'public',
      );
      let user_id = '';
      if (userId === agent.user_id) {
        user_id = agent.user_id;
      } else  {
        if (!customer) {
          console.log("%c ************ CANCEL ORDER WHEN CUSTOMER DELETED ************", "background: #222; color: #bada55");
          const canceledOrder = await this.updateOrder(id, {
            cancel_reason,
            status: OrderStatusEnum.CANCELLED,
          });
          return canceledOrder[0];
        } else {
          user_id = customer.user_id;
        }
      }
      let targetGroup =
        user_id === agent.user_id
          ? NotificationSegmentEnum.CUSTOMER
          : NotificationSegmentEnum.AGENT;
      if (!order) {
        throw new Error('Order not found');
      }

      // SEND NOTIFICATION
      if (order.booking) {
        await this.notificationService.createUserInAppAndPushNotification(
          {
            userId: user_id === agent.user_id ? customer.user_id : agent.user_id,
            message: `Đơn hàng dịch vụ #${order.booking.booking_no} đã bị huỷ bởi ${
              user_id === agent.user_id ? `đại lý` : `khách hàng`
            }`,
            heading: `Đơn hàng dịch vụ #${order.booking.booking_no}`,
            targetGroup: targetGroup,
            data: { booking_id: order.booking.id },
            type: user_id === agent.user_id
              ? NotificationTypeEnum.AGENT_CANCEL_BOOKING
              : NotificationTypeEnum.CUSTOMER_CANCEL_BOOKING,
            image: user_id === agent.user_id ? agent.avatar : customer.avatar,
          }
        );
      } else {
        await this.notificationService.createUserInAppAndPushNotification(
          {
            userId: user_id === agent.user_id ? customer.user_id : agent.user_id,
            message: `Đơn hàng sản phẩm #${order.order_no} đã bị huỷ bởi ${
              userId === agent.user_id ? `đại lý` : `khách hàng`
            }`,
            heading: `Đơn hàng #${order.order_no}`,
            targetGroup: targetGroup,
            data: { order_id: order.id },
            type: user_id === agent.user_id
              ? NotificationTypeEnum.AGENT_CANCEL_BOOKING
              : NotificationTypeEnum.CUSTOMER_CANCEL_BOOKING,
            image: user_id === agent.user_id ? agent.avatar : customer.avatar,
          }
        );
        this.appGateway.server.emit(`ROOM_${order.agent_id}`, {
          action: OrderEventActionEnum.ORDER_CANCELLED,
          data: {
            order_id: order.id,
          },
          channel: 'CARX_ORDER',
        });
      }
      console.log("************ CANCEL BOOKING WHEN CUSTOMER NOT DELETED ************");
      const canceledOrder = await this.updateOrder(id, {
        cancel_reason,
        status: OrderStatusEnum.CANCELLED,
      });
      return canceledOrder[0];
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async reportOrder(id: string, report_reason: string): Promise<OrderModel> {
    try {
      const order = await this.getOrderDetail(id);
      if (!order) {
        throw new Error('Order not found');
      } else if (order.status === OrderStatusEnum.COMPLETED) {
        const reportedOrder = await this.updateOrder(id, {
          report_reason: report_reason,
          status: OrderStatusEnum.REPORTED,
        });
        return reportedOrder;
      } else {
        throw new Error('Cannot report incomplete order');
      }
    } catch (error) {
      throw error;
    }
  }

  countOrderByCondition(condition: any): Promise<number> {
    const queryCondition = this.buildSearchQueryCondition(condition);
    return this.orderRepository.countByCondition(queryCondition);
  }

  sumOrderByCondition(condition: any): Promise<number> {
    const queryCondition = this.buildSearchQueryCondition(condition);
    return this.orderRepository.sumByCondition(queryCondition);
  }

  getOrderListByConditionWithoutPagination(
    condition: any,
  ): Promise<OrderModel[]> {
    return this.orderRepository.findAllByConditionWithoutPagination(condition);
  }

  getOrderListByConditionWithoutPaginationUsingQueryBuilder(
    condition: any,
  ): Promise<OrderModel[]> {
    const queryCondition = this.buildSearchQueryCondition(condition);
    return this.orderRepository.findAllByConditionWithoutPagination(
      queryCondition,
    );
  }

  buildSearchQueryCondition(condition: Record<string, any>) {
    let queryCondition = {
      ...condition,
    };
    const removeKeys = ['limit', 'page', 'start_date', 'end_date'];
    for (const key of Object.keys(queryCondition)) {
      for (const value of removeKeys) {
        if (key === value) {
          delete queryCondition[key];
        }
      }
    }
    if (condition.start_date && condition.end_date) {
      const startDate = new Date(condition.start_date);
      const endDate = new Date(condition.end_date);
      queryCondition = {
        ...queryCondition,
        created_at: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
      };
    } else if (condition.end_date && !condition.start_date) {
      const endDate = new Date(condition.end_date);
      queryCondition = {
        ...queryCondition,
        created_at: {
          [Op.lte]: endDate,
        },
      };
    } else if (condition.start_date && !condition.end_date) {
      const startDate = new Date(condition.start_date);
      queryCondition = {
        ...queryCondition,
        created_at: {
          [Op.gte]: startDate,
        },
      };
    }
    return queryCondition;
  }

  // Receive order value + promotion code -> return promotion applied value
  private async applyPromotion(
    preOrderValue: number,
    promotionCode: string,
  ): Promise<number> {
    let processedOrderValue = preOrderValue;
    let promotionValueApplied = 0;
    const promotion = await this.promotionService.getPromotionByCondition({
      code: promotionCode,
    });
    if (!promotion) {
      throw new Error('Promotion not found or promotion code is invalid');
    }
    if (processedOrderValue < promotion.min_value) {
      throw new Error(
        'Cannot apply promotion because total order price is less than minimum promotion value',
      );
    }
    if (promotion.discount_type === PromotionDiscountTypeEnum.BY_PRICE) {
      promotionValueApplied = promotion.value;
      processedOrderValue -= promotionValueApplied;
    } else {
      let distance = (processedOrderValue * promotion.value) / 100;
      promotionValueApplied =
        distance > promotion.max_value ? promotion.max_value : distance;
    }
    return promotionValueApplied;
  }

  // Receive order value -> return point used + point value
  private async applyCustomerPoint(
    preOrderValue: number,
    customer: CustomerModel,
  ): Promise<[number, number]> {
    const currentCustomerPoint = customer.point;
    const currentCustomerAvailablePoints = customer.available_points;
    let pointUsed = 0;
    let pointValue = 0;
    const customerPointUsageConfiguration =
      await this.systemConfigurationService.getSystemConfigurationDetailByCondition(
        { name: 'Sử dụng điểm' },
      );
    if (!customerPointUsageConfiguration) {
      throw new Error(
        'Cannot apply customer point, customer point configuration not found',
      );
    }
    if (!customerPointUsageConfiguration.is_enabled) {
      throw new Error('Customer point usage configuration currently disabled');
    }
    const pointConfiguration =
      await this.systemConfigurationService.getSystemConfigurationDetailByCondition(
        { name: 'Điểm sử dụng trong ngày' },
      );
    if (!pointConfiguration) {
      throw new Error('Point configuration not found');
    }
    if (!pointConfiguration.is_enabled) {
      throw new Error('Point configuration currently disabled');
    }
    if (currentCustomerPoint < 1 || currentCustomerAvailablePoints < 1) {
      throw new Error(
        'Not enough point or Customer has used maximum point per day',
      );
    }
    const maxUsablePoint = Math.floor(
      preOrderValue / customerPointUsageConfiguration.apply_value,
    );
    pointUsed =
      currentCustomerPoint < maxUsablePoint
        ? currentCustomerPoint
        : maxUsablePoint;
    if (pointUsed > currentCustomerAvailablePoints) {
      pointUsed = currentCustomerAvailablePoints;
    }
    pointValue = pointUsed * customerPointUsageConfiguration.apply_value;
    const newCustomerPoint = currentCustomerPoint - pointUsed;
    const newCustomerAvailablePoints =
      currentCustomerAvailablePoints - pointUsed;
    await this.customerService.updateCustomer(
      customer.id,
      { point: newCustomerPoint, available_points: newCustomerAvailablePoints },
      'public',
    );
    return [pointUsed, pointValue];
  }

  // Receive order value -> return VAT value applied
  private async applyVAT(preOrderValue: number): Promise<number> {
    let vatValueApplied = 0;
    const vatConfiguration =
      await this.systemConfigurationService.getSystemConfigurationDetailByCondition(
        { name: 'VAT' },
      );
    if (!vatConfiguration) {
      throw new Error('VAT configuration not found');
    }

    if (vatConfiguration.is_enabled) {
      vatValueApplied = (preOrderValue * vatConfiguration.apply_value) / 100;
    } else {
      throw new Error('VAT currently disabled');
    }
    return vatValueApplied;
  }

  // Receive order value + customer model -> calculate customer point value
  private async calculateCustomerPoint(
    orderValue: number,
    customer: CustomerModel,
  ): Promise<void> {
    const userPointAccumulateConfiguration =
      await this.systemConfigurationService.getSystemConfigurationDetailByCondition(
        { name: 'Tích luỹ điểm' },
      );
    if (!userPointAccumulateConfiguration) {
      return
    }
    let pointValue = 0;
    let currentCustomerPoint = customer.point;
    if (userPointAccumulateConfiguration.is_enabled) {
      if (!userPointAccumulateConfiguration.compare_value) {
        return;
      }
      pointValue =
        currentCustomerPoint +
        Math.floor(orderValue / userPointAccumulateConfiguration.apply_value);
      await this.customerService.updateCustomer(
        customer.id,
        { point: pointValue },
        'public',
      );
    } else {
      console.log('Tích luỹ điểm disabled')
      return
    }
  }

  async totalOrdersByEachStatus(
    payload: GetCountOrderByEachStatusDto,
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
        throw new Error('Agent not found');
      }
      condition = {
        agent_id: agent.id,
      };
    } else if (customer_id) {
      const customer = await this.customerService.getCustomerDetail(
        customer_id,
        'public',
      );
      if (!customer) {
        throw new Error('Customer not found');
      }
      condition = {
        customer_id: customer.id,
      };
    }
    const numberOfCreatedOrders = await this.countOrderByCondition({
      ...condition,
      status: OrderStatusEnum.CREATED,
      type: OrderTypeEnum.PHYSICAL_PURCHASED,
      is_deleted: false,
    });

    const numberOfPurchasedOrders = await this.countOrderByCondition({
      ...condition,
      status: OrderStatusEnum.PURCHASED,
      type: OrderTypeEnum.PHYSICAL_PURCHASED,
      is_deleted: false,
    });

    const numberOfProcessingOrders = await this.countOrderByCondition({
      ...condition,
      status: OrderStatusEnum.PROCESSING,
      type: OrderTypeEnum.PHYSICAL_PURCHASED,
      is_deleted: false,
    });

    const numberOfDeliveringOrders = await this.countOrderByCondition({
      ...condition,
      status: OrderStatusEnum.DELIVERING,
      type: OrderTypeEnum.PHYSICAL_PURCHASED,
      is_deleted: false,
    });

    const numberOfCancelledOrders = await this.countOrderByCondition({
      ...condition,
      status: OrderStatusEnum.CANCELLED,
      type: OrderTypeEnum.PHYSICAL_PURCHASED,
      is_deleted: false,
    });

    const numberOfReportedOrders = await this.countOrderByCondition({
      ...condition,
      status: OrderStatusEnum.REPORTED,
      type: OrderTypeEnum.PHYSICAL_PURCHASED,
      is_deleted: false,
    });

    const numberOfCompletedOrders = await this.countOrderByCondition({
      ...condition,
      status: OrderStatusEnum.COMPLETED,
      type: OrderTypeEnum.PHYSICAL_PURCHASED,
      is_deleted: false,
    });

    const data = {
      created_orders: numberOfCreatedOrders,
      purchased_orders: numberOfPurchasedOrders,
      processing_orders: numberOfProcessingOrders,
      delivering_orders: numberOfDeliveringOrders,
      canceled_orders: numberOfCancelledOrders,
      reported_orders: numberOfReportedOrders,
      completed_orders: numberOfCompletedOrders,
    };
    return data;
  }

  async sendDataToInsuranceCompany(order: OrderModel): Promise<void> {
    try {
      const customer = await this.customerService.getCustomerDetail(order.customer_id, 'public');
      if (!customer) {
        throw new Error('Customer not found')
      }
      const url = `${process.env.CATHAY_URL}`;
      const token = `${process.env.CATHAY_TOKEN}`;
      const insuranceProduct =
        await this.insuranceProductService.getInsuranceProductByCondition({
          product_id: order.items[0].product_id,
        });
      const sendingData = this.getCathayInsurancePayload(
        order.insurance_info,
        insuranceProduct,
      );
      let cathayResponseData = null;
      try {
        // let retry = 5;
        // let testResult = null;
        // do {
        //   testResult = await this.curlService.sendPostRequestWithCustomHeader({
        //     url: url,
        //     data: sendingData,
        //     header: {TOKEN: token},
        //   });
        //   console.log("************* CALL CATHAY API *************");
        //   console.log(testResult);
        //   if (!testResult.status) {
        //     --retry;
        //     new Promise((r) => setTimeout(r, 500));
        //   } else {
        //     retry = 0;
        //     cathayResponseData = testResult;
        //   }
        //   console.log("RETRY NUMBER: ", retry);
        // } while (retry > 0);
        cathayResponseData = await this.curlService.sendPostRequestWithCustomHeader({
          url: url,
          data: sendingData,
          header: {TOKEN: token},
        });
        console.log('AXIOS CATHAY RESPONSE');
        console.log(cathayResponseData);
      } catch (error) {
        await this.notificationService.createUserInAppAndPushNotification(
          {
            userId: customer.user_id,
            message: `Tạo hợp đồng bảo hiểm thất bại`,
            heading: `Hợp đồng bảo hiểm`,
            targetGroup: NotificationSegmentEnum.CUSTOMER,
            data: { order_id: order.id },
            type: NotificationTypeEnum.INSURANCE_CONTRACT_CREATION_FAILED,
          }
        );
        this.appGateway.server.emit('CREATE_INSURANCE_CONTRACT_FAILED', {
          action: 'SEND_DATA_TO_CATHAY_INSURANCE',
          data: {
            order_id: order.id,
          },
          channel: 'CARX_ORDER',
        });
        await this.cancelOrder(order.id, 'Không thể tạo hợp đồng bảo hiểm', customer.user_id);
        console.log(error);
        throw error;
      }
      let axiosResponseData: any = {};
      let insuranceContractReturnData: any = {};
      if (cathayResponseData.data) {
        axiosResponseData = cathayResponseData?.data;
      } else {
        axiosResponseData = cathayResponseData?.response?.data;
      }
      insuranceContractReturnData = axiosResponseData.RETURN_DATA;
      console.log('CATHAY RESPONSE DATA');
      console.log(insuranceContractReturnData);
      if (axiosResponseData && axiosResponseData.RETURN_STATUS == '200') {
        const contractData: any = {
          product_id: insuranceProduct.product_id,
          order_id: order.id,
          contract_no: insuranceContractReturnData.POL_NO,
          carx_contract_number: insuranceContractReturnData.CARX_NO,
          frame_no: insuranceContractReturnData.FRAM_NO,
          customer_certificate_number: sendingData.CERTIFICATE_NUMBER,
          customer_certificate_type: sendingData.CERTIFICATE_TYPE,
          customer_email: sendingData.EMAIL,
          send_date: parse(
            sendingData.SEND_DATE_INFO,
            'yyyy-MM-dd-HH.mm.ss.000000',
            new Date(),
            { locale: vi },
          ),
          engine_no: sendingData.ENGN_NO,
          customer_name: sendingData.CUSTOMER_NAME,
          customer_phone_number: sendingData.PHONE_NUMBER || null,
          start_date: startOfDay(parse(sendingData.POL_DT, 'yyyy-MM-dd', new Date(), {
            locale: vi,
          })),
          end_date: endOfDay(parse(sendingData.POL_DUE_DT, 'yyyy-MM-dd', new Date(), {
            locale: vi,
          })),
          capacity: insuranceProduct.capacity,
          insurance_amount: insuranceProduct.insurance_amount,
          car_type_code: insuranceProduct.car_type_code,
          price: order.value,
          usage_code: insuranceProduct.usage_code,
        }
        if (insuranceContractReturnData.POL_NO_VOLUNTARY) {
          contractData.voluntary_contract_no = insuranceContractReturnData.POL_NO_VOLUNTARY;
          contractData.voluntary_insurance_amount = insuranceProduct.voluntary_amount;
        }
        const createdContract =
          await this.insuranceContractService.createInsuranceContract({...contractData});
        if (createdContract) {
          await this.notificationService.createUserInAppAndPushNotification(
            {
              userId: customer.user_id,
              message: `Hợp đồng bảo hiểm đã được tạo thành công`,
              heading: `Hợp đồng bảo hiểm`,
              targetGroup: NotificationSegmentEnum.CUSTOMER,
              data: { order_id: order.id },
              type: NotificationTypeEnum.INSURANCE_CONTRACT_SUCCESSFULLY_CREATED,
              image: customer.avatar ?? null,
            }
          );
          this.appGateway.server.emit('CREATE_INSURANCE_CONTRACT_SUCCESSFUL', {
            action: 'SEND_DATA_TO_CATHAY_INSURANCE',
            data: {
              order_id: order.id,
            },
            channel: 'CARX_ORDER',
          });
          await this.updateOrder(order.id, { status: OrderStatusEnum.COMPLETED });
        }
      } else {
        await this.notificationService.createUserInAppAndPushNotification(
          {
            userId: customer.user_id,
            message: `Tạo hợp đồng bảo hiểm thất bại`,
            heading: `Hợp đồng bảo hiểm`,
            targetGroup: NotificationSegmentEnum.CUSTOMER,
            data: { order_id: order.id },
            type: NotificationTypeEnum.INSURANCE_CONTRACT_CREATION_FAILED,
          }
        );
        this.appGateway.server.emit('CREATE_INSURANCE_CONTRACT_FAILED', {
          action: 'SEND_DATA_TO_CATHAY_INSURANCE',
          data: {
            order_id: order.id,
          },
          channel: 'CARX_ORDER',
        });
        await this.cancelOrder(order.id, 'Không thể tạo hợp đồng bảo hiểm', customer.user_id);
      }
    } catch (error) {
      console.log('Send Data To Insurance Company Error:', error.message);
      throw error;
    }
  }

  private validateInsurancePayload(
    orderInsuranceInfo: OrderInsuranceType,
    insuranceProduct: InsuranceProductModel,
  ) {
    try {
      const isValidEmail = validateEmail(orderInsuranceInfo.email);
      const certificateNumber = orderInsuranceInfo.certificate_number;
      // email validation
      if (!isValidEmail) {
        throw new Error('Incorrect email format');
      }
      if (orderInsuranceInfo.car_type_code !== insuranceProduct.car_type_code) {
        throw new Error('Mismatch car_type_code with insurance product')
      }
      // Certificate number validation
      let certificateType = null;
      if (certificateNumber.length === 9 || certificateNumber.length === 12) {
        certificateType = InsuranceInfoCertificateTypeEnum.IDENTITY_NUMBER;
      } else if (
          certificateNumber.length === 8 &&
          /[A-Z]/.test(certificateNumber.charAt(0))
      ) {
        certificateType = InsuranceInfoCertificateTypeEnum.PASSPORT;
      } else if (
          certificateNumber.length === 10 ||
          certificateNumber.length === 13
      ) {
        certificateType = InsuranceInfoCertificateTypeEnum.TAX_NUMBER;
      } else {
        throw new Error('Certificate number is not in the correct format');
      }
      // insurance time validation
      if (insuranceProduct.max_insurance_time - orderInsuranceInfo.insurance_time < 0) {
        throw new Error('Invalid insurance time');
      }
      if ((insuranceProduct.is_voluntary && insuranceProduct.is_combo) && orderInsuranceInfo.insurance_time !== 1) {
        throw new Error('Voluntary insurance product only serves 1 year')
      }
      // Frame no validation
      if (!orderInsuranceInfo.frame_no) {
        throw new Error('Frame No must be specified');
      } else if (orderInsuranceInfo.frame_no.length !== 17) {
        throw new Error('Frame No must be exactly 17 character');
      }

      if (
          orderInsuranceInfo.phone_number &&
          (orderInsuranceInfo.phone_number.length !== 10 ||
              orderInsuranceInfo.phone_number.charAt(0) !== '0')
      ) {
        throw new Error('Invalid phone number');
      }
      let maxCapacity = 0;
      if (insuranceProduct.capacity === 100) {
        if (orderInsuranceInfo.car_type_code !== '22') {
          throw new Error('car_type_code invalid');
        }
        maxCapacity = orderInsuranceInfo.capacity;
      } else if (insuranceProduct.car_type_code === '11') {
        if (orderInsuranceInfo.capacity !== insuranceProduct.capacity) {
          throw new Error('Maximum motorbike capacity is 2')
        }
        maxCapacity = 2;
      } else if (orderInsuranceInfo.capacity !== insuranceProduct.capacity) {
        throw new Error('Invalid capacity')
      } else {
        maxCapacity = insuranceProduct.capacity;
      }

      const data = {
        ...orderInsuranceInfo,
        certificate_type: certificateType,
        max_capacity: maxCapacity,
      }
      return data;
    } catch (error) {
      throw error
    }
  }

  private getCathayInsurancePayload(
    orderInsuranceInfo: OrderInsuranceType,
    insuranceProduct: InsuranceProductModel,
  ): CathayInsuranceRequestPayloadType {
    const validatedData = this.validateInsurancePayload(orderInsuranceInfo, insuranceProduct);
    let insuranceStartDate = orderInsuranceInfo.start_date;
    let insuranceEndDate = format(
      add(parse(insuranceStartDate, 'yyyy-MM-dd', new Date()), {
        years: orderInsuranceInfo.insurance_time,
      }),
      'yyyy-MM-dd',
      { locale: vi },
    );
    let sendDateInfo = format(new Date(), 'yyyy-MM-dd-HH.mm.ss.000000', {
      locale: vi,
    });
    console.log(insuranceProduct);
    let data: CathayInsuranceRequestPayloadType = {
      CUSTOMER_NAME: validatedData.customer_name,
      CERTIFICATE_NUMBER: validatedData.certificate_number,
      CERTIFICATE_TYPE: validatedData.certificate_type,
      ADDRESS: validatedData.address,
      CARX_NO: orderInsuranceInfo.carx_contract_number,
      AMT: insuranceProduct.insurance_amount + '',
      EMAIL: validatedData.email,
      PHONE_NUMBER: validatedData.phone_number,
      RGST_NO: validatedData.rgst_no,
      ENGN_NO: validatedData.engine_no,
      FRAM_NO: validatedData.frame_no,
      SEND_DATE_INFO: sendDateInfo,
      POL_DT: insuranceStartDate,
      IS_VOLUNTARY: 'N',
      POL_DUE_DT: insuranceEndDate,
      PREM: insuranceProduct.required_non_tax_price * orderInsuranceInfo.insurance_time + '',
      TAXES: `${
        (insuranceProduct.required_taxed_price -
        insuranceProduct.required_non_tax_price) * orderInsuranceInfo.insurance_time
      }`,
      IS_BUSSINESS: insuranceProduct.is_business ? '1' : '0',
      VEHC_KD: insuranceProduct.car_type_code,
      VEHC_PURP: insuranceProduct.usage_code,
      MAX_CAPL: validatedData.max_capacity + '',
    };

    if (insuranceProduct.is_voluntary) {
      data = {
        ...data,
        IS_VOLUNTARY: 'Y',
        AMT_VOLUNTARY: insuranceProduct.voluntary_amount  + '',
        PREM_VOLUNTARY: insuranceProduct.voluntary_price * orderInsuranceInfo.insurance_time,
        INSR_CNT: insuranceProduct.voluntary_seats + '',
        MAX_CAPL: validatedData.max_capacity + '',
      };
    }
    Object.keys(data).forEach(
      (key) => data[key] === undefined && delete data[key],
    );
    return data;
  }
}
