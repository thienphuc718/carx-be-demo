import {
  BelongsTo,
  Column,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  DataType,
  PrimaryKey,
  HasMany,
  ForeignKey,
  HasOne,
} from 'sequelize-typescript';
import {
  OrderStatusEnum,
  OrderTypeEnum,
} from '../modules/orders/enum/OrderEnum';
import { PaymentMethodEnum } from '../modules/orders/enum/PaymentEnum';
import { OrderItemModel } from './OrderItems';
import { AgentModel } from './Agents';
import { CustomerModel } from './Customers';
import { PaymentMethod, TransportationMethod } from '../constants';
import { ReviewModel } from './Reviews';
import { BookingModel } from './Bookings';
import { TransactionModel } from './Transactions';
import {OrderInsuranceType} from "../modules/orders/dto/requests/OrderRequestDto";
import {InsuranceContractModel} from "./InsuranceContracts";

@Table({
  modelName: 'orders',
})
export class OrderModel extends Model<OrderModel> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({
    type: DataType.DOUBLE,
  })
  value: number;

  @Column({
    type: DataType.STRING,
  })
  tracking_code: string;

  @Column({
    type: DataType.STRING,
  })
  agent_promotion_code: string;

  @Column({
    type: DataType.STRING,
  })
  carx_promotion_code: string;

  @Column({
    type: DataType.STRING,
  })
  transportation_method: string;

  @Column({
    type: DataType.ENUM('PHYSICAL_PURCHASED', 'BOOKING'),
    // allowNull: false,
    defaultValue: 'PHYSICAL_PURCHASED',
  })
  type: OrderTypeEnum;

  @Column({
    type: DataType.ENUM(
      'CREATED',
      'PROCESSING',
      'COMPLETED',
      'CANCELLED',
      'PURCHASED',
      'DELIVERING',
      'REPORTED',
    ),
    defaultValue: 'CREATED',
  })
  status: OrderStatusEnum;

  @Column({
    type: DataType.STRING,
  })
  cancel_reason: string;

  @Column({
    type: DataType.ENUM('MOMO', 'CASH', 'ONEPAY'),
    defaultValue: 'CASH',
  })
  payment_method: PaymentMethodEnum;

  @ForeignKey(() => CustomerModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  customer_id: string;

  @Column({
    type: DataType.UUID,
    // allowNull: false,
  })
  agent_id: string;

  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
  })
  order_no: number;

  @Column({
    type: DataType.STRING,
  })
  report_reason: string;

  @Column({
    type: DataType.STRING,
  })
  invoice_image: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_vat_exported: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_deleted: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_customer_point_applied: boolean;

  @Column({
    type: DataType.DOUBLE,
  })
  initial_value: number;

  @Column({
    type: DataType.DOUBLE,
    defaultValue: 0,
  })
  vat_value_applied: number;
  
  @Column({
    type: DataType.FLOAT,
    defaultValue: 0,
  })
  promotion_value_applied: number;
  
  @Column({
    type: DataType.DOUBLE,
    defaultValue: 0,
  })
  point_value_applied: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  point_used: number; 

  @Column({
    type: DataType.STRING
  })
  vat_image: string;

  @Column({
    type: DataType.JSONB
  })
  address: Record<string, any>;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_insurance_order: boolean;

  @Column({
    type: DataType.JSONB,
  })
  insurance_info: OrderInsuranceType;

  @HasOne(() => InsuranceContractModel)
  insurance_contract: InsuranceContractModel;

  @HasMany(() => OrderItemModel, 'order_id')
  items: OrderItemModel[];

  @HasOne(() => ReviewModel, 'order_id')
  review: ReviewModel;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @BelongsTo(() => CustomerModel, 'customer_id')
  customer: CustomerModel;

  @BelongsTo(() => AgentModel, 'agent_id')
  agent: AgentModel;

  @HasOne(() => BookingModel)
  booking: BookingModel;

  @HasOne(() => TransactionModel)
  transaction: TransactionModel;

  transformToResponse() {
    const orderDetail = JSON.parse(JSON.stringify(this));
    const { items, review } = orderDetail;
    let paymentProviders = new PaymentMethod();
    let paymentMethod = null;
    for (let i = 0; i < paymentProviders.methods.length; i++) {
      if (paymentProviders.methods[i].code == orderDetail.payment_method) {
        paymentMethod = paymentProviders.methods[i];
      }
    }
    let transportationProviders = new TransportationMethod();
    let transportationMethod = null;
    for (let i = 0; i < transportationProviders.methods.length; i++) {
      if (
        transportationProviders.methods[i].code ==
        orderDetail.transportation_method
      ) {
        transportationMethod = transportationProviders.methods[i];
      }
    }
    let itemData = null;
    if (items) {
      itemData = items.map((item) => {
        const { product } = item;
        const variant = product.variants[0];
        return {
          id: item.id,
          quantity: item.quantity,
          price: item.price,
          product_sku: item.product_sku,
          name: product.name,
          product_id: item.product_id,
          created_at: item.created_at,
          updated_at: item.updated_at,
          is_guaranteed: product.is_guaranteed,
          product: {
            guarantee_time_unit: product.guarantee_time_unit,
            guarantee_time: product.guarantee_time,
            guarantee_note: product.guarantee_note,
            description: product.description,
            currency_unit: product.currency_unit,
            type: product.type,
            status: product.status,
            images: variant.images,
          },
        };
      });
    }

    const data = {
      id: orderDetail.id,
      value: orderDetail.value,
      status: orderDetail.status,
      customer_id: orderDetail.customer_id,
      agent_id: orderDetail.agent_id,
      tracking_code: orderDetail.tracking_code,
      created_at: orderDetail.created_at,
      updated_at: orderDetail.updated_at,
      order_no: orderDetail.order_no,
      order_items: itemData,
      payment_method: paymentMethod,
      is_vat_exported: orderDetail.is_vat_exported,
      transportation_method: transportationMethod,
      agent_promotion_code: orderDetail.agent_promotion_code,
      carx_promotion_code: orderDetail.carx_promotion_code,
      address: orderDetail.address,
      cancel_reason: orderDetail.cancel_reason,
      report_reason: orderDetail.report_reason,
      initial_value: orderDetail.initial_value,
      vat_value_applied: orderDetail.vat_value_applied,
      promotion_value_applied: orderDetail.promotion_value_applied,
      is_customer_point_applied: orderDetail.is_customer_point_applied,
      point_value_applied: orderDetail.point_value_applied,
      point_used: orderDetail.point_used,
      invoice_image: orderDetail.invoice_image,
      vat_image: orderDetail.vat_image,
      is_deleted: orderDetail.is_deleted,
      agent: orderDetail.agent,
      customer: orderDetail.customer,
      review: review,
      transaction: orderDetail.transaction,
      is_insurance_order: orderDetail.is_insurance_order,
      insurance_info: orderDetail.insurance_info,
      insurance_contract: orderDetail.insurance_contract,
    };
    if (orderDetail.booking) {
      data['is_booking'] = true;
    } else {
      data['is_booking'] = false;
    }
    return data;
  }

  // static transformToOrderDetail(order: OrderModel): OrderEntityResponseDto {
  //   const orderDetail = JSON.parse(JSON.stringify(order));
  //   const data = {
  //     id: orderDetail.id,
  //     value: orderDetail.value,
  //     transaction_id: orderDetail.transaction_id,
  //     type: orderDetail.type,
  //     status: orderDetail.status,
  //     customer_id: orderDetail.customer_id,
  //     agent_id: orderDetail.agent_id,
  //     tracking_code: orderDetail.tracking_code,
  //     is_deleted: orderDetail.is_deleted,
  //     created_at: orderDetail.created_at,
  //     updated_at: orderDetail.updated_at,
  //     order_items: orderDetail.items,
  //   };
  //   return data;
  // }
}
