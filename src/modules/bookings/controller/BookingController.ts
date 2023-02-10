import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseController } from '../../../BaseController';
import { AuthGuard } from '../../../guards';
import { IBookingService } from '../service/BookingServiceInterface';
import * as express from 'express';
import {
  CreateBookingPayloadDto,
  CreateIncurringItemsPayloadDto,
  FilterListBookingDto,
  GetCountBookingByEachStatusDto,
  ReportBookingPayloadDto,
  UpdateBookingPayloadDto,
  UpdateServiceItemsPayload,
} from '../dto/BookingDto';
import { Result } from '../../../results/Result';
import { CancelOrderPayloadDto } from '../../orders/dto/requests/OrderRequestDto';

@ApiTags('Bookings')
@Controller('/v1/bookings')
export class BookingController extends BaseController {
  constructor(
    @Inject(IBookingService)
    private readonly bookingService: IBookingService,
  ) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get All Bookings' })
  async getAllBookings(
    @Res() response: express.Response,
    @Query() getBookingsDto: FilterListBookingDto,
  ) {
    try {
      const bookings = await this.bookingService.getBookingList(getBookingsDto);
      const data = bookings.map((booking) => booking.transformToResponse());
      const total = await this.bookingService.countBookingByCondition(
        getBookingsDto,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: {
          booking_list: data,
          total: total,
        },
      });
      return this.ok(response, result.value);
    } catch (error) {
      const err = Result.fail({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
      return this.fail(response, err.error);
    }
  }

  @Get('/total/each-status')
  @ApiOperation({ summary: 'Get Total Booking By Each Status' })
  async getTotalBookingByEachStatus(
    @Res() response: express.Response,
    @Query() getBookingsDto: GetCountBookingByEachStatusDto,
  ) {
    try {
      const data = await this.bookingService.totalBookingByEachStatus(
        getBookingsDto,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: data,
      });
      return this.ok(response, result.value);
    } catch (error) {
      const err = Result.fail({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
      return this.fail(response, err.error);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Booking Detail' })
  async getBookingDetail(
    @Res() response: express.Response,
    @Param('id') bookingId: string,
  ) {
    try {
      const booking = await this.bookingService.getBookingDetail(bookingId);
      let result = null;
      if (!booking) {
        result = Result.fail({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Booking details not found',
        });
      } else {
        result = Result.ok({
          statusCode: HttpStatus.OK,
          data: booking.transformToResponse(),
        });
      }
      return this.ok(response, result.value);
    } catch (error) {
      const err = Result.fail({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
      return this.fail(response, err.error);
    }
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create Booking' })
  async createNewBooking(
    @Res() response: express.Response,
    @Body() createBookingDto: CreateBookingPayloadDto,
    @Req() request: express.Request,
  ) {
    try {
      const createdBooking = await this.bookingService.createBooking(
        createBookingDto,
        request.user.id,
      );
      const bookingDetail = await this.bookingService.getBookingDetail(
        createdBooking.id,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: bookingDetail.transformToResponse(),
      });
      return this.ok(response, result.value);
    } catch (error) {
      const err = Result.fail({
        statusCode: error.code ? HttpStatus.BAD_REQUEST : HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
        errorCode: error.code,
        data: error.value
      });
      return this.fail(response, err.error);
    }
  }

  @Put(':id/incurring-items')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Add incurring items' })
  async addBookingIncurringCost(
    @Res() response: express.Response,
    @Body() createIncurringItemsPayloadDto: CreateIncurringItemsPayloadDto,
    @Param('id') bookingId: string,
  ) {
    try {
      const updatedBooking = await this.bookingService.createIncurringItems(
        bookingId,
        createIncurringItemsPayloadDto.incurring_items,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: updatedBooking.transformToResponse(),
      });
      return this.ok(response, result.value);
    } catch (error) {
      const err = Result.fail({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
      return this.fail(response, err.error);
    }
  }

  @Put(':id/service-items')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update service items price' })
  async updateServiceItemsPrice(
    @Res() response: express.Response,
    @Body() updateServiceItemsPayload: UpdateServiceItemsPayload,
    @Param('id') bookingId: string,
  ) {
    try {
      const updatedBooking = await this.bookingService.updateServiceItems(
        bookingId,
        updateServiceItemsPayload.service_items,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: updatedBooking.transformToResponse(),
      });
      return this.ok(response, result.value);
    } catch (error) {
      const err = Result.fail({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
      return this.fail(response, err.error);
    }
  }

  @Put(':id/cancel')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Cancel Booking' })
  async cancelBooking(
    @Res() response: express.Response,
    @Body() cancelBookingDto: CancelOrderPayloadDto,
    @Param('id') bookingId: string,
    @Req() request: express.Request,
  ) {
    try {
      const userId = request.user.id
      const canceledBooking = await this.bookingService.cancelBooking(
        bookingId,
        cancelBookingDto.cancel_reason,
        userId,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: canceledBooking.transformToResponse(),
      });
      return this.ok(response, result.value);
    } catch (error) {
      const err = Result.fail({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
      return this.fail(response, err.error);
    }
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update Booking' })
  async updateBooking(
    @Res() response: express.Response,
    @Body() updateBookingDto: UpdateBookingPayloadDto,
    @Param('id') bookingId: string,
  ) {
    try {
      const updatedBooking = await this.bookingService.updateBooking(
        bookingId,
        updateBookingDto,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: updatedBooking.transformToResponse(),
      });
      return this.ok(response, result.value);
    } catch (error) {
      const err = Result.fail({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
      return this.fail(response, err.error);
    }
  }

  @Patch(':id/report')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Report Booking' })
  async reportBooking(
    @Res() response: express.Response,
    @Body() reportBookingDto: ReportBookingPayloadDto,
    @Param('id') bookingId: string,
  ) {
    try {
      const reportedBooking = await this.bookingService.reportBooking(
        bookingId,
        reportBookingDto.report_reason,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: reportedBooking.transformToResponse(),
      });
      return this.ok(response, result.value);
    } catch (error) {
      const err = Result.fail({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
      return this.fail(response, err.error);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete A Booking' })
  async deleteBooking(
    @Res() response: express.Response,
    @Param('id') bookingId: string,
  ) {
    try {
      await this.bookingService.deleteBooking(bookingId);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        message: 'Successfully deleted a booking',
      });
      return this.ok(response, result.value);
    } catch (error) {
      const err = Result.fail({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
      return this.fail(response, err.error);
    }
  }
}
