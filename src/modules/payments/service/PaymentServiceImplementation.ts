import {HttpStatus, Inject} from '@nestjs/common';
import {ICustomerService} from '../../customers/service/customer/CustomerServiceInterface';
import {IOrderService} from '../../orders/service/order/OrderServiceInterface';
import {ITransactionService} from '../../transactions/service/TransactionServiceInterface';
import {CreatePaymentRequestDto, PaymentNotificationPayloadDto,} from '../dto/PaymentDto';
import {IMoMoPaymentService} from './momo/MoMoPaymentServiceInterface';
import {IPaymentService} from './PaymentServiceInterface';
import {
  TransactionPaymentMethodEnum,
  TransactionPaymentTypeEnum,
  TransactionStatusEnum,
} from '../../transactions/enum/TransactionEnum';
import {PaymentMethodEnum} from '../../orders/enum/PaymentEnum';
import {IBookingService} from '../../bookings/service/BookingServiceInterface';
import {BookingStatusEnum} from '../../bookings/enum/BookingEnum';
import {CreateMoMoPaymentMethodRequestType} from "../type/MoMoPaymentType";

export class PaymentServiceImplementation implements IPaymentService {
  constructor(
    @Inject(IMoMoPaymentService)
    private momoPaymentService: IMoMoPaymentService,
    @Inject(IOrderService) private orderService: IOrderService,
    @Inject(ICustomerService) private customerService: ICustomerService,
    @Inject(ITransactionService)
    private transactionService: ITransactionService,
    @Inject(IBookingService) private bookingService: IBookingService,
  ) {}

  async createPaymentRequest(
    payload: CreatePaymentRequestDto,
  ): Promise<{ statusCode: HttpStatus; message: string; data?: any }> {
    try {
      const { payment_method, user_id, order_id, email } = payload;
      const order = await this.orderService.getOrderDetail(order_id);
      if (!order) {
        throw new Error('Order not found');
      }
      if (order.value >= 50_000_000) {
        throw new Error('Không thể thanh toán đơn hàng có giá trị lớn hơn hoặc bằng 50 triệu VND');
      }
      if (
        (payment_method === TransactionPaymentMethodEnum.MOMO_ATM
          || payment_method === TransactionPaymentMethodEnum.MOMO_CREDIT_CARD) &&
        order.value < 10_000
      ) {
        throw new Error('Không thể thanh toán đơn hàng có giá trị bé hơn 10,000 VND với hình thức thanh toán này');
      }
      if (!order.customer_id) {
        throw new Error('Cannot create a payment transaction with order which has deleted customer');
      }
      if (order.booking) {
        const booking = await this.bookingService.getBookingDetail(order.booking.id);
        if (!booking) {
          throw new Error('Booking not found');
        }
        if (booking.status !== BookingStatusEnum.WAITING_FOR_PAYMENT) {
          throw new Error('Booking is not ready for payment yet');
        }
        if (payment_method !== TransactionPaymentMethodEnum.CASH && booking.online_payment_attempt >= 3) {
          throw new Error('Exceeded booking online payment attempts')
        }
      }
      const customer = await this.customerService.getCustomerDetailByCondition(
        { user_id },
        'public',
      );
      if (!customer) {
        throw new Error('Unauthorized to create payment request');
      }
      const transaction = await this.transactionService.getTransactionDetailByCondition({ order_id: order.id });
      if (transaction) {
        if (order.booking) {
          const booking = await this.bookingService.getBookingDetail(order.booking.id);
          let currentOnlinePaymentAttempt = booking.online_payment_attempt;
          payment_method !== TransactionPaymentMethodEnum.CASH &&
            await this.bookingService.updateBooking(booking.id, { online_payment_attempt: ++currentOnlinePaymentAttempt });
          await transaction.destroy({ force: true });
        } else {
          throw new Error(`${order.booking ? `Booking` : `Order`} payment has already been created`);
        }
      }
      // create transaction record to save the payment transaction to database
      const newTransaction = await this.transactionService.createTransaction({
        order_id: order.id,
        customer_id: customer.id,
        agent_id: order.agent_id,
        payment_method: payment_method,
        payment_type:
          payment_method === TransactionPaymentMethodEnum.CASH
            ? TransactionPaymentTypeEnum.OFFLINE
            : TransactionPaymentTypeEnum.ONLINE,
      });
      if (!newTransaction) {
        throw new Error('Cannot create a new transaction');
      }
      // pass data to momo service
      if (newTransaction.payment_type === TransactionPaymentTypeEnum.ONLINE) {
        if (order.payment_method === PaymentMethodEnum.CASH) {
          throw new Error('Order is being paid by cash, cannot use online payment');
        }
        if (newTransaction.payment_method === TransactionPaymentMethodEnum.CASH) {
          throw new Error('Wrong payment method');
        }
        const momoSendingData: CreateMoMoPaymentMethodRequestType = {
          order: order,
          transaction: newTransaction,
          payment_type: payment_method,
        }
        if (email) {
          momoSendingData.email = email;
        }
        const momoResponseData = await this.momoPaymentService.createPaymentMethodRequest(momoSendingData);
        let responseData: any = {}
        if (momoResponseData?.response?.data) {
          responseData = momoResponseData?.response?.data;
        } else {
          responseData = momoResponseData?.data;
        }
        // handling response data
        if (!responseData || responseData.resultCode !== 0) {
          const transactionPaymentResponseData: any = {
            resultCode: responseData.resultCode,
            message: responseData.message,
            response_time: responseData.responseTime,
          }
          newTransaction.payment_provider_response_data = transactionPaymentResponseData;
          newTransaction.changed('payment_provider_response_data', true);
          newTransaction.status = TransactionStatusEnum.FAILED;
          await newTransaction.save();
          if (order.booking) {
            if (order.booking.online_payment_attempt >= 3) {
              await this.bookingService.cancelBooking(order.booking.id, 'Payment failed', user_id);
            } else {
              await this.bookingService.updateBooking(order.booking.id, { online_payment_attempt: ++order.booking.online_payment_attempt });
            }
          } else {
            await this.orderService.cancelOrder(order.id, 'Payment failed', user_id);
          }
          throw {
            statusCode: transactionPaymentResponseData.resultCode || HttpStatus.BAD_REQUEST,
            message: transactionPaymentResponseData.message || 'Fail to create payment request',
          };
        }
        if (!responseData.requestId || responseData.requestId !== newTransaction.id) {
          throw new Error(
            'Mismatch transaction ID with payment provider request ID',
          );
        }
        let orderId = responseData.orderId;
        if (!orderId) {
          throw new Error('Order ID is required');
        }
        if (orderId.includes('_')) {
          orderId = responseData.orderId.split('_')[0];
        }
        if (orderId !== newTransaction.order_id) {
          throw new Error('Mismatch order ID with request ID');
        }
        const transactionPaymentProviderResponseData: any = {
          pay_url: responseData.payUrl,
          request_id: responseData.requestId,
          message: responseData.message,
          result_code: responseData.resultCode,
          deep_link: responseData.deeplink || null,
          deep_link_mini_app: responseData.deeLinkMiniApp || null,
          qr_code_url: responseData.qrCodeUrl || null,
          response_time: responseData.responseTime || null,
        };
        newTransaction.payment_provider_response_data = transactionPaymentProviderResponseData;
        newTransaction.changed('payment_provider_response_data', true);
        newTransaction.status = TransactionStatusEnum.PENDING;
        await newTransaction.save();
        return {
          statusCode: HttpStatus.OK,
          message: responseData.message || 'Your order has been processed successfully',
          data: {
            pay_url: newTransaction.payment_provider_response_data.pay_url,
            deep_link: newTransaction.payment_provider_response_data.deep_link,
            deep_link_mini_app: newTransaction.payment_provider_response_data.deep_link_mini_app,
            qr_code_url: newTransaction.payment_provider_response_data.qr_code_url,
          },
        };
      } else {
        newTransaction.status = TransactionStatusEnum.SUCCEEDED;
        await newTransaction.save();
        if (order.booking) {
          const booking = await this.bookingService.getBookingDetail(order.booking.id);
          if (!booking) {
            throw new Error('Booking not found')
          }
          if (booking.status !== BookingStatusEnum.WAITING_FOR_PAYMENT) {
            throw new Error('Your booking is not ready for payment');
          }
          await this.bookingService.updateBooking(order.booking.id, { status: BookingStatusEnum.COMPLETED });
        }
        return {
          statusCode: HttpStatus.OK,
          message: 'Your order has been processed successfully',
          data: newTransaction,
        };
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async processPaymentNotification(
    payload: PaymentNotificationPayloadDto & {[key: string]: any},
  ): Promise<{ statusCode: HttpStatus }> {
    try {
      const { requestId, resultCode, ...rest } = payload;
      const transaction =
        await this.transactionService.getTransactionDetailByCondition({
          id: requestId,
        });
      if (!transaction) {
        throw new Error('Transaction not found');
      }
      if (
        transaction.payment_provider_response_data.request_id !== transaction.id
      ) {
        throw new Error('Transaction is not legitimate');
      }
      let orderId = rest.orderId;
      if (orderId.includes('_')) {
        orderId = orderId.split('_')[0];
      }
      const order = await this.orderService.getOrderDetail(orderId);
      if (!order) {
        throw new Error('Order not found');
      }
      const customer = await this.customerService.getCustomerDetail(order.customer_id, 'public');
      const transactionPaymentProviderResponseData =
        transaction.payment_provider_response_data;
      if (resultCode !== 0) {
        transactionPaymentProviderResponseData.result_code = resultCode;
        transactionPaymentProviderResponseData.message = rest.message;
        transaction.payment_provider_response_data = {
          ...transaction.payment_provider_response_data,
          ...transactionPaymentProviderResponseData,
        };
        transaction.changed('payment_provider_response_data', true);
        await transaction.save();
        if (order.booking) {
          // console.log('******* Cancel Booking *******');
          if (order.booking.online_payment_attempt >= 3) {
            await this.bookingService.cancelBooking(order.booking.id, 'Payment failed', customer.user_id);
          } else {
            await this.bookingService.updateBooking(order.booking.id, { online_payment_attempt: ++order.booking.online_payment_attempt });
          }
        } else {
          console.log('******* Cancel Order *******');
          await this.orderService.cancelOrder(order.id, 'Payment failed', customer.user_id);
        }
        return { statusCode: HttpStatus.NO_CONTENT };
      }
      transactionPaymentProviderResponseData.result_code = resultCode;
      transactionPaymentProviderResponseData.pay_type = rest.payType;
      transactionPaymentProviderResponseData.signature = rest.signature;
      transactionPaymentProviderResponseData.message = rest.message;
      transactionPaymentProviderResponseData.order_type = rest.orderType;
      transactionPaymentProviderResponseData.response_time = rest.responseTime;
      transactionPaymentProviderResponseData.transaction_id = rest.transId;
      transaction.payment_provider_response_data = {
        ...transaction.payment_provider_response_data,
        ...transactionPaymentProviderResponseData,
      };
      transaction.changed('payment_provider_response_data', true);
      transaction.status = TransactionStatusEnum.SUCCEEDED;
      const isTransactionSaved = await transaction.save();
      if (!isTransactionSaved) {
        throw new Error('Cannot update transaction');
      }
      if (order.booking) {
        console.log('******* Complete Booking Payment *******');
        await this.bookingService.updateBooking(order.booking.id, { status : BookingStatusEnum.COMPLETED });
      } else {
        console.log('******* Complete Order Payment *******');
        // await this.orderService.updateOrder(order.id, { status : OrderStatusEnum.COMPLETED });
        if (order.is_insurance_order) {
          await this.orderService.sendDataToInsuranceCompany(order);
        }
      }
      return { statusCode: HttpStatus.NO_CONTENT };
    } catch (error) {
      throw error;
    }
  }
}
