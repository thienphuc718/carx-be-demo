import { OrderModel } from '../../../models';
import { TransactionModel } from '../../../models/Transactions';
import { CurrencyUnitEnum } from '../../products/enum/ProductEnum';
import { MoMoRequestTypeEnum } from '../enum/MoMoEnum';

export type MoMoEWalletItemRequestType = {
  id: string; // SKU number
  name: string;
  description?: string;
  category?: string;
  imageUrl?: string;
  manufacturer?: string; // agent name
  price: number; // floating points number
  currency: CurrencyUnitEnum;
  quantity: number;
  unit: string;
  lang: string;
  totalPrice: number;
  taxAmount?: number;
};

export type MoMoEWalletUserInfoRequestType = {
  name?: string;
  phoneNumber?: string;
  email?: string;
};

export type MoMoPaymentMethodRequestPayloadType = {
  partnerCode: string;
  partnerName: string;
  storeId: string; // agent_id
  requestType: MoMoRequestTypeEnum;
  redirectUrl: string;
  ipnUrl?: string;
  orderId: string; // order_id
  amount: number;
  orderInfo: string;
  requestId: string; // transaction_id
  extraData: string;
  signature: string; // base64 encoded with accesskey
  lang: string;
  items?: MoMoEWalletItemRequestType[];
  userInfo?: MoMoEWalletUserInfoRequestType;
};

export type CreateMoMoPaymentMethodRequestType = {
  order: OrderModel;
  transaction: TransactionModel;
  payment_type: string;
  email?: string;
};
