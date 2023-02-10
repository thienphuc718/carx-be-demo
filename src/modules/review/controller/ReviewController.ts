import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiExcludeController,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BaseController } from '../../../BaseController';
import * as express from 'express';
import { Result } from '../../../results/Result';
import { IReviewService } from '../service/ReviewServiceInteface';
import { GetListReviewDto, ReviewDto, UpdateReviewDto } from '../dto/ReviewDto';
import { AuthGuard } from '../../../guards';

@ApiTags('Reviews')
@Controller('/v1/reviews')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class ReviewController extends BaseController {
  constructor(
    @Inject(IReviewService)
    private readonly reviewService: IReviewService,
  ) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get list reviews' })
  async getListReviews(
    @Res() response: express.Response,
    @Query() query: GetListReviewDto,
  ) {
    try {
      const [total, reviews] = await this.reviewService.getListReviews(query);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: {
          review_list: reviews,
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

  @Post()
  @ApiOperation({ summary: 'Create Review' })
  async createReview(
    @Res() response: express.Response,
    @Body() payload: ReviewDto,
  ) {
    try {
      const createdReview = await this.reviewService.createReview(payload);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: createdReview,
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

  @Put(':id')
  @ApiOperation({ summary: 'Update Review' })
  async updateRole(
    @Res() response: express.Response,
    @Body() payload: UpdateReviewDto,
    @Param('id') reviewId: string,
  ) {
    try {
      const [_, updatedReview] = await this.reviewService.updateReview(
        reviewId,
        payload,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        message: 'Review updated',
        data: updatedReview,
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
