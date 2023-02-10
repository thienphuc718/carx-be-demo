import { PaymentMethodEnum } from '../modules/orders/enum/PaymentEnum';

export const SALT_ROUNDS = 10;

export class TransportationMethod {
  public methods = [
    {
      code: 'QUICK_DELIVERY',
      name: 'Giao hàng tận nơi',
      estimated_date: 2,
      fee: 0,
      icon: 'https://lannis-bucket.s3.ap-southeast-1.amazonaws.com/QUICK_DELIVERY.png',
    },
    {
      code: 'AT_AGENT_GARAGE',
      name: 'Nhận hàng tại đại lý',
      estimated_date: 0,
      fee: 0,
      icon: 'https://lannis-bucket.s3.ap-southeast-1.amazonaws.com/AT_AGENT_GARAGE.png',
    },
  ];
}

export class PaymentMethod {
  public methods = [
    {
      code: PaymentMethodEnum.MOMO,
      name: 'Thanh toán với Momo',
      icon: 'https://lannis-bucket.s3.ap-southeast-1.amazonaws.com/icon-momo.png',
      show_for: ['agent', 'customer'],
    },
    {
      code: PaymentMethodEnum.CASH,
      name: 'Thanh toán tiền mặt',
      icon: 'https://lannis-bucket.s3.ap-southeast-1.amazonaws.com/icon-cash.png',
      show_for: ['customer'],
    },
    {
      code: PaymentMethodEnum.ONEPAY,
      name: 'Thanh toán với thông tin ngân hàng',
      icon: 'https://lannis-bucket.s3.ap-southeast-1.amazonaws.com/icon-onepay.png',
      show_for: ['agent', 'customer'],
    },
  ];
}

export class CompanyCategory {
  public list = [
    {
      name: 'Sửa chữa bảo dưỡng',
    },
    {
      name: 'Rửa xe',
    },
    {
      name: 'Độ xe',
    },
    {
      name: 'Mâm lốp',
    },
    {
      name: 'Ắc quy',
    },
    {
      name: 'Phụ tùng / phụ kiện',
    },
    {
      name: 'Cứu hộ',
    },
    {
      name: 'Bảo hiểm',
    },
  ];
}

export enum CARX_SETTING {
  ID = 'de398550-75f1-42f0-9949-be43744617d0',
  DEFAULT_PASSWORD = 'carx@0407',
}

export enum CARX_MODULES {
  ACTIVITIES = 'ACTIVITIES',
  AGENTS = 'AGENTS',
  AUTH = 'AUTH',
  BOOKINGS = 'BOOKINGS',
  CARS = 'CARS',
  COMPANIES = 'COMPANIES',
  CUSTOMERS = 'CUSTOMERS',
  FEATURES = 'FEATURES',
  FILES = 'FILES',
  ORDERS = 'ORDERS',
  PAYMENTS = 'PAYMENTS',
  PRODUCTS = 'PRODUCTS',
  PROMOTIONS = 'PROMOTIONS',
  REVIEWS = 'REVIEWS',
  SERVICES = 'SERVICES',
  STAFFS = 'STAFFS',
  TRANSPORTATION = 'TRANSPORTATION',
  USERS = 'USERS',
  CONTENTS = 'CONTENTS',
  AGENT_CATEGORIES = 'AGENT_CATEGORIES',
  NEWS = 'NEWS',
  CONFIGURATIONS = 'CONFIGURATIONS',
  NOTIFICATIONS = 'NOTIFICATIONS',
  REPORTS = 'REPORTS',
  USER_INTERFACE = 'USER_INTERFACE',
}
