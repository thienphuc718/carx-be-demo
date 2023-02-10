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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseController } from '../../../BaseController';
import { ICompanyService } from '../service/CompanyServiceInterface';
import * as express from 'express';
import {
  CreateCompanyDto,
  FilterCompanyDto,
  UpdateCompanyDto,
} from '../dto/CompanyDto';
import { Result } from '../../../results/Result';

@ApiTags('Companies')
@Controller('/v1/companies')
export class CompanyController extends BaseController {
  constructor(
    @Inject(ICompanyService)
    private readonly companyService: ICompanyService,
  ) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get All Companies' })
  async getAllCompanies(
    @Res() response: express.Response,
    @Query() getCompaniesDto: FilterCompanyDto,
  ) {
    try {
      const companies = await this.companyService.getCompanyList(
        getCompaniesDto,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: companies,
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
  @ApiOperation({ summary: 'Get Company Detail' })
  async getCompanyDetail(
    @Res() response: express.Response,
    @Param('id') companyId: string,
  ) {
    try {
      const company = await this.companyService.getCompanyDetail(companyId);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: company,
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
  @ApiOperation({ summary: 'Create Company' })
  async createNewCompany(
    @Res() response: express.Response,
    @Body() createCompanyDto: CreateCompanyDto,
  ) {
    try {
      const createdCompany = await this.companyService.createCompany(
        createCompanyDto,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: createdCompany,
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
  @ApiOperation({ summary: 'Update Company' })
  async updateCompany(
    @Res() response: express.Response,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @Param('id') companyId: string,
  ) {
    try {
      const [_, updatedCompany] = await this.companyService.updateCompany(
        companyId,
        updateCompanyDto,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: updatedCompany[0],
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
  @ApiOperation({ summary: 'Delete A Company' })
  async deleteCompany(
    @Res() response: express.Response,
    @Param('id') companyId: string,
  ) {
    try {
      await this.companyService.deleteCompany(companyId);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        message: 'Successfully deleted a company',
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
