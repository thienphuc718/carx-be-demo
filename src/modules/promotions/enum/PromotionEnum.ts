export enum PromotionDiscountTypeEnum {
  BY_PERCENTAGE = 0,
  BY_PRICE = 1
}

export enum PromotionTypeEnum {
  DISCOUNT_VOUCHER = 0,
  DISCOUNT_SHIPPING_PRICE = 1,
  INCLUDE_GIFTS = 2,
}

export enum PromotionStatusEnum {
  CREATED = 'CREATED',
  ACTIVATING = 'ACTIVATING',
  EXPIRED = 'EXPIRED',
}

export enum PromotionProviderEnum {
  AGENT = 'AGENT',
  CARX = 'CARX',
}