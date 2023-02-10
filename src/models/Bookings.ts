import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
  ForeignKey,
} from 'sequelize-typescript';
import { CustomerModel } from './Customers';
import { AgentModel } from './Agents';
import { OrderModel } from './Orders';
import { OrderItemModel } from './OrderItems';
import { BookingStatusEnum } from '../modules/bookings/enum/BookingEnum';

@Table({
  modelName: 'bookings',
})
export class BookingModel extends Model<BookingModel> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ForeignKey(() => OrderModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  order_id: string;

  @Column({
    type: DataType.DATE,
  })
  booking_date: string;

  @Column({
    type: DataType.STRING,
  })
  booking_hour: string;

  @Column({
    type: DataType.DATE,
  })
  completed_date: string;

  @Column({
    type: DataType.STRING,
  })
  completed_hour: string;

  @ForeignKey(() => CustomerModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  customer_id: string;

  @ForeignKey(() => AgentModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  agent_id: string;

  @Column({
    type: DataType.TEXT,
  })
  note: string;

  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
  })
  booking_no: number;

  @Column({
    type: DataType.STRING,
  })
  invoice_image: string;

  @Column({
    type: DataType.STRING,
  })
  vat_image: string;

  @Column({
    type: DataType.STRING,
  })
  report_reason: string;

  @Column({
    type: DataType.ENUM(
      'CREATED',
      'CONFIRMED',
      'PROCESSING',
      'WAITING_FOR_PAYMENT',
      'COMPLETED',
      'CANCELLED',
      'REPORTED',
      'QUOTATION_SENT',
      'QUOTATION_CONFIRMED',
    ),
    defaultValue: 'CREATED',
  })
  status: BookingStatusEnum;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_deleted: boolean;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  online_payment_attempt: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @BelongsTo(() => AgentModel)
  agent: AgentModel;

  @BelongsTo(() => CustomerModel)
  customer: CustomerModel;

  @BelongsTo(() => OrderModel)
  order: OrderModel;

  transformToResponse() {
    try {
      const bookingData = JSON.parse(JSON.stringify(this));
      const { order, agent, customer, agent_id, customer_id, ...booking } =
        bookingData;
      let serviceItems = [];
      if (order.items && order.items.length) {
        for (let i = 0; i < order.items.length; i++) {
          const product = order.items[i].product;
          const service = product.services[0];
          serviceItems.push({
            price: order.items[i].price,
            service_code: order.items[i].product_sku,
            id: order.items[i].id,
            product_id: order.items[i].product_id,
            name: service ? service.name : product.name,
            product: {
              is_guaranteed: product.is_guaranteed,
              guarantee_time_unit: product.guarantee_time_unit,
              guarantee_time: product.guarantee_time,
              guarantee_note: product.guarantee_note,
              type: product.type,
              currency_unit: product.currency_unit,
              status: product.status,
              images: product.images,
            },
            service: service
              ? {
                  id: service.id,
                  other_info: service.other_info,
                  description: service.description,
                  guarantee_note: service.note,
                }
              : null,
            is_incurring: order.items[i].is_incurring || undefined,
            quantity: order.items[i].is_incurring
              ? order.items[i].quantity
              : undefined,
          });
        }
      }

      const service_items = serviceItems.filter(
        (item: OrderItemModel) => !item.is_incurring,
      );
      const incurring_items = serviceItems.filter(
        (item: OrderItemModel) => item.is_incurring,
      );
      return {
        service_items,
        incurring_items,
        value: order.value,
        initial_value: order.initial_value,
        vat_value_applied: order.vat_value_applied,
        promotion_value_applied: order.promotion_value_applied,
        point_value_applied: order.point_value_applied,
        point_used: order.point_used,
        status: order.status,
        is_customer_point_applied: order.is_customer_point_applied,
        is_vat_exported: order.is_vat_exported,
        cancel_reason: order.cancel_reason,
        payment_method: order.payment_method,
        report_reason: order.report_reason,
        review: order.review,
        transaction: order.transaction,
        agent: agent,
        customer: customer,
        ...booking,
      };
    } catch (error) {
      throw error;
    }
  }
}
