export enum TransactionStatusEnum {
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  PENDING = 'PENDING',
}

export enum TransactionPaymentMethodEnum {
  CASH = 'CASH',
  MOMO_E_WALLET = 'MOMO_E_WALLET',
  MOMO_ATM = 'MOMO_ATM',
  MOMO_CREDIT_CARD = 'MOMO_CREDIT_CARD',
}

export enum TransactionPaymentTypeEnum {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
}