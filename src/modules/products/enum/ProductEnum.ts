export enum ProductTypeEnum {
  PHYSICAL = 'PHYSICAL',
  SERVICE = 'SERVICE',
}

export enum ProductStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
}

export enum CurrencyUnitEnum {
  VND = 'VND',
  USD = 'USD',
}

export enum ProductGuaranteeTimeUnitEnum {
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  YEAR = 'YEAR',
}

export enum OrderByEnum {
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at',
}

export enum OrderTypeEnum {
  DESC = 'desc',
  ASC = 'asc',
}

export enum ProductExcelColumnEnum {
  PRODUCT_CODE = 1,
  IMAGES = 2,
  NAME = 3,
  PRICE = 4,
  IS_DISCOUNTED = 5,
  DISCOUNT_PRICE = 6,
  IS_GUARANTEED = 7,
  DAY_GUARANTEE_TIME = 8,
  MONTH_GUARANTEE_TIME = 9,
  YEAR_GUARANTEE_TIME = 10,
  GUARANTEE_NOTE = 11,
  DESCRIPTION = 12,
  QUANTITY = 13
}
