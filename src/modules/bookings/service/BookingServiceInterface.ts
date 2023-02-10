import { BookingModel } from '../../../models/Bookings';
import { OrderItemPayloadDto } from '../../orders/dto/requests/OrderItemRequestDto';
import {
  BookingPayloadDto,
  FilterListBookingDto,
  GetCountBookingByEachStatusDto,
  UpdateServiceItemPriceDto,
} from '../dto/BookingDto';

export interface IBookingService {
  getBookingList(payload: FilterListBookingDto): Promise<BookingModel[]>;
  getBookingDetail(id: string): Promise<BookingModel>;
  createBooking(payload: BookingPayloadDto, userId: string): Promise<BookingModel>;
  updateBooking(id: string, payload: BookingPayloadDto): Promise<BookingModel>;
  updateServiceItems(
    bookingId: string,
    serviceItems: UpdateServiceItemPriceDto[],
  ): Promise<BookingModel>;
  deleteBooking(id: string): Promise<void>;
  cancelBooking(id: string, reason: string, userId: string): Promise<BookingModel>;
  createIncurringItems(
    bookingId: string,
    payload: OrderItemPayloadDto[],
  ): Promise<BookingModel>;
  countBookingByCondition(condition: any): Promise<number>
  reportBooking(id: string, reason: string): Promise<BookingModel>;
  totalBookingByEachStatus(condition: GetCountBookingByEachStatusDto): Promise<any>;
}

export const IBookingService = Symbol('IBookingService');
