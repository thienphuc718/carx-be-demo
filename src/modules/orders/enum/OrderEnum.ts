export enum OrderTypeEnum {
  PHYSICAL_PURCHASED = 'PHYSICAL_PURCHASED',
  BOOKING = 'BOOKING',
}

export enum OrderStatusEnum {
  CREATED = 'CREATED',
  PURCHASED = 'PURCHASED',
  PROCESSING = 'PROCESSING',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  DELIVERING = 'DELIVERING',
  REPORTED = 'REPORTED',
}

export enum OrderEventActionEnum {
  ORDER_CREATED = 'ORDER_CREATED',
  ORDER_PROCESSING = 'ORDER_PROCESSING',
  ORDER_CANCELLED = 'ORDER_CANCELLED',
  ORDER_COMPLETED = 'ORDER_COMPLETED',
  ORDER_DELIVERING = 'ORDER_DELIVERING',
  ORDER_REPORTED = 'ORDER_REPORTED',
  ORDER_PURCHASED = 'ORDER_PURCHASED',
}

export enum InsuranceInfoCertificateTypeEnum {
  IDENTITY_NUMBER = '1',
  PASSPORT = '3',
  TAX_NUMBER = '5',
}