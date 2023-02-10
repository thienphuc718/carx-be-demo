import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Put,
  Query,
  Res,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseController } from '../../../../BaseController';
import { AuthGuard, PermissionGuard } from '../../../../guards';
import { ISectionService } from '../service/SectionServiceInterface';
import * as express from 'express';
import {
  FilterSectionDto,
  UpdateSectionDto,
  UpdateSectionOrderDto,
} from '../dto/SectionDto';
import { CARX_MODULES } from '../../../../constants';
import { Result } from '../../../../results/Result';

@Controller('/v1/sections')
@ApiTags('Sections')
export class SectionController extends BaseController {
  constructor(
    @Inject(ISectionService) private sectionService: ISectionService,
  ) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get All Sections' })
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard)
  async getSectionList(
    @Res() response: express.Response,
    @Query() filterSectionDto: FilterSectionDto,
  ) {
    try {
      const [sections, count] = await Promise.all([
        this.sectionService.getSectionListByCondition(filterSectionDto),
        this.sectionService.countByCondition(filterSectionDto),
      ]);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: {
          section_list: sections,
          total: count,
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
  @ApiOperation({ summary: 'Get Section Detail' })
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard)
  async getSectionDetail(
    @Param('id') sectionId: string,
    @Res() response: express.Response,
  ) {
    try {
      const section = await this.sectionService.getSectionDetail(sectionId);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: section,
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
  @ApiOperation({ summary: 'Update Section' })
  @SetMetadata('permission', CARX_MODULES.USER_INTERFACE)
  @ApiBearerAuth()
  @UseGuards(AuthGuard, PermissionGuard)
  async updateSection(
    @Param('id') sectionId: string,
    @Res() response: express.Response,
    @Body() updateSectionDto: UpdateSectionDto,
  ) {
    try {
      const section = await this.sectionService.updateSectionById(
        sectionId,
        updateSectionDto,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: section,
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

  @Put('/:id/order')
  @ApiOperation({ summary: 'Update Section Order' })
  @SetMetadata('permission', CARX_MODULES.USER_INTERFACE)
  @ApiBearerAuth()
  @UseGuards(AuthGuard, PermissionGuard)
  async updateSectionOrder(
    @Param('id') sectionId: string,
    @Res() response: express.Response,
    @Body() updateSectionDto: UpdateSectionOrderDto,
  ) {
    try {
      const section = await this.sectionService.updateSectionOrder(
        sectionId,
        updateSectionDto,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: section,
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
