import { BookingModel } from '../../../models/Bookings';

export interface IBookingRepository {
  findAll(): Promise<BookingModel[]>;
  findAllByCondition(limit: number, page: number, condition: any): Promise<BookingModel[]>;
  findById(id: string): Promise<BookingModel>;
  create(payload: any): Promise<BookingModel>;
  update(id: string, payload: any): Promise<[number, BookingModel[]]>;
  delete(id: string): void;
  count(condition?: any): Promise<number>;
}

export const IBookingRepository = Symbol('IBookingRepository');
