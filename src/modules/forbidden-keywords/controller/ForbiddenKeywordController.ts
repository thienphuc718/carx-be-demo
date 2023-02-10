import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  ForbiddenException,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Res,
  Req,
  UseGuards,
  forwardRef
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
import { IForbiddenKeywordService } from '../service/ForbiddenKeywordServiceInterface';
import { IStaffService } from '../../staffs/service/StaffServiceInterface';
import { GetListForbiddenKeywordDto, ForbiddenKeywordDto, UpdateForbiddenKeywordDto } from '../dto/ForbiddenKeywordDto';
import { AuthGuard } from '../../../guards';

@ApiTags('Forbidden Keywords')
@Controller('/v1/forbidden-keywords')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class ForbiddenKeywordController extends BaseController {
  constructor(
    @Inject(IForbiddenKeywordService)
    private readonly forbiddenKeywordService: IForbiddenKeywordService,
    @Inject(forwardRef(() => IStaffService))
    private readonly staffService: IStaffService,
  ) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get list forbidden keywords' })
  async getListForbiddenKeywords(
    @Res() response: express.Response,
    @Query() query: GetListForbiddenKeywordDto,
  ) {
    try {
      const [total, forbiddenKeywords] = await this.forbiddenKeywordService.getListForbiddenKeywords(query);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: {
          forbidden_keyword_list: forbiddenKeywords,
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
  @ApiOperation({ summary: 'Create forbidden keyword' })
  async createForbiddenKeyword(
    @Res() response: express.Response,
    @Body() payload: ForbiddenKeywordDto,
    @Req() request: express.Request,
  ) {
    try {
      const isStaffUser = await this.staffService.isStaffUser(request.user.id);
      if (!isStaffUser) {
        throw new ForbiddenException({
          statusCode: HttpStatus.FORBIDDEN,
          message: 'User is not staff',
        });
      }
      const createdForbiddenKeyword = await this.forbiddenKeywordService.createForbiddenKeyword(payload);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: createdForbiddenKeyword,
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
  @ApiOperation({ summary: 'Update forbidden keyword' })
  async updateRole(
    @Res() response: express.Response,
    @Body() payload: UpdateForbiddenKeywordDto,
    @Req() request: express.Request,
    @Param('id') forbiddenKeywordId: string,
  ) {
    try {
      const isStaffUser = await this.staffService.isStaffUser(request.user.id);
      if (!isStaffUser) {
        throw new ForbiddenException({
          statusCode: HttpStatus.FORBIDDEN,
          message: 'User is not staff',
        });
      }
      const [_, updatedForbiddenKeyword] = await this.forbiddenKeywordService.updateForbiddenKeyword(
        forbiddenKeywordId,
        payload,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        message: 'forbidden keyword updated',
        data: updatedForbiddenKeyword,
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
  @ApiOperation({ summary: 'Delete a forbidden keyword' })
  async deleteRole(
    @Res() response: express.Response,
    @Param('id') keywordId: string,
    @Req() request: express.Request,
  ) {
    try {
      const isStaffUser = await this.staffService.isStaffUser(request.user.id);
      if (!isStaffUser) {
        throw new ForbiddenException({
          statusCode: HttpStatus.FORBIDDEN,
          message: 'User is not staff',
        });
      }
      await this.forbiddenKeywordService.deleteForbiddenKeyword(keywordId);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        message: 'Successfully deleted a keyword',
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
