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
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseController } from '../../../BaseController';
import { IRecommendedKeywordService } from '../service/RecommendedKeywordServiceInterface';
import * as express from 'express';
import {
  CreateRecommendedKeywordDto,
  FilterRecommendedKeywordDto,
  UpdateRecommendedKeywordDto,
} from '../dto/RecommendedKeywordDto';
import { Result } from '../../../results/Result';
import { AuthGuard } from '../../../guards';

@Controller('/v1/recommended-keywords')
@ApiTags('Recommended Keywords')
export class RecommendedKeywordController extends BaseController {
  constructor(
    @Inject(IRecommendedKeywordService)
    private readonly recommendedKeywordService: IRecommendedKeywordService,
  ) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get Recommended Keyword List' })
  async getRecommendedKeywordListBy(
    @Res() response: express.Response,
    @Query() filterRecommendedKeywordDto: FilterRecommendedKeywordDto,
  ) {
    try {
      const recommendedKeywords =
        await this.recommendedKeywordService.getRecommendedKeywordListByCondition(
          filterRecommendedKeywordDto,
        );
      const total =
        await this.recommendedKeywordService.countRecommendedKeywordByCondition(
          filterRecommendedKeywordDto,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: {
          recommended_keyword_list: recommendedKeywords,
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

  @Get(':id')
  @ApiOperation({ summary: 'Get Recommended Keyword Detail' })
  async getRecommendedKeywordDetail(
    @Res() response: express.Response,
    @Query() recommendedKeywordId: string,
  ) {
    try {
      const recommendedKeyword =
        await this.recommendedKeywordService.getRecommendedKeywordDetail(
          recommendedKeywordId,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: recommendedKeyword,
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
  @ApiOperation({ summary: 'Create Recommended Keyword' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async createNewRecommendedKeyword(
    @Res() response: express.Response,
    @Body() payload: CreateRecommendedKeywordDto,
    @Req() request: express.Request,
  ) {
    try {
      const user = request.user;
      if (!user.is_staff) {
        throw new Error('User is not staff');
      }
      const recommendedKeyword =
        await this.recommendedKeywordService.createRecommendedKeyword(payload);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: recommendedKeyword,
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
  @ApiOperation({ summary: 'Update Recommended Keyword' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async updateRecommendedKeyword(
    @Res() response: express.Response,
    @Query() recommendedKeywordId: string,
    @Body() payload: UpdateRecommendedKeywordDto,
    @Req() request: express.Request,
  ) {
    try {
      const user = request.user;
      if (!user.is_staff) {
        throw new Error('User is not staff');
      }
      const recommendedKeyword =
        await this.recommendedKeywordService.updateRecommendedKeyword(
          recommendedKeywordId,
          payload,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: recommendedKeyword,
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
  @ApiOperation({ summary: 'Delete recommended keyword ' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async deleteRecommendedKeyword(
    @Res() response: express.Response,
    @Param('id') recommendedKeywordId: string,
    @Req() request: express.Request,
  ) {
    try {
      const user = request.user;
      if (!user.is_staff) {
        throw new Error('User is not staff');
      }
      const isKeywordDeleted =
        await this.recommendedKeywordService.deleteRecommendedKeyword(
          recommendedKeywordId,
        );
      let result = null;
      if (!isKeywordDeleted) {
        result = Result.fail({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Cannot update Recommended Keyword',
        });
        return this.fail(response, result.error);
      } else {
        result = Result.ok({
          statusCode: HttpStatus.OK,
          message: 'Recommended Keyword deleted successfully',
        });
        return this.ok(response, result.value);
      }
    } catch (error) {
      const err = Result.fail({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
      return this.fail(response, err.error);
    }
  }
}
