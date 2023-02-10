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
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiExcludeController } from '@nestjs/swagger';
import { BaseController } from '../../../BaseController';
import * as express from 'express';
import { Result } from '../../../results/Result';
import { CompanyCategory } from '../../../constants';

@ApiTags('Company Categories')
@ApiExcludeController()
@Controller('/v1/company-categories')
export class CompanyCategoryController extends BaseController {
  constructor() {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get All Company Categories' })
  async getAllCompanyCategories(
    @Res() response: express.Response
  ) {
    try {
      let categories = new CompanyCategory;
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: categories.list,
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
