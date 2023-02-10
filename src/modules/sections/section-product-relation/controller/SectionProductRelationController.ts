import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Res,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseController } from '../../../../BaseController';
import { CARX_MODULES } from '../../../../constants';
import { AuthGuard, PermissionGuard } from '../../../../guards';
import { ISectionProductRelationService } from '../service/SectionProductRelationServiceInterface';
import * as express from 'express';
import {
  CreateSectionProductRelationPayloadDto,
  UpdateSectionProductRelationPayloadDto,
} from '../dto/SectionProductRelationDto';
import { Result } from '../../../../results/Result';

@Controller('/v1/section-products')
@ApiTags('Section Products')
export class SectionProductRelationController extends BaseController {
  constructor(
    @Inject(ISectionProductRelationService)
    private sectionProductRelationService: ISectionProductRelationService,
  ) {
    super();
  }

  @Post()
  @ApiOperation({ summary: 'Create Section Product Item' })
  @ApiBearerAuth()
  @SetMetadata('permission', CARX_MODULES.USER_INTERFACE)
  @UseGuards(AuthGuard, PermissionGuard)
  async createSectionProductRelation(
    @Res() response: express.Response,
    @Body() sectionProductDto: CreateSectionProductRelationPayloadDto,
  ) {
    try {
      const createdItem = await this.sectionProductRelationService.create(
        sectionProductDto,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: createdItem,
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

  @Put('/:sectionId/products/:productId')
  @ApiOperation({ summary: 'Update Section Product Item Order' })
  @ApiBearerAuth()
  @SetMetadata('permission', CARX_MODULES.USER_INTERFACE)
  @UseGuards(AuthGuard, PermissionGuard)
  async updateSectionProductRelation(
    @Res() response: express.Response,
    @Param('sectionId') sectionId: string,
    @Param('productId') productId: string,
    @Body()
    updateSectionProductRelationDto: UpdateSectionProductRelationPayloadDto,
  ) {
    try {
      const updatedItem =
        await this.sectionProductRelationService.updateByCondition(
          { section_id: sectionId, product_id: productId },
          updateSectionProductRelationDto,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: updatedItem,
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

  @Delete('/:sectionId/products/:productId')
  @ApiOperation({ summary: 'Delete Section Product Item' })
  @ApiBearerAuth()
  @SetMetadata('permission', CARX_MODULES.USER_INTERFACE)
  @UseGuards(AuthGuard, PermissionGuard)
  async deleteSectionProductRelation(
    @Res() response: express.Response,
    @Param('sectionId') sectionId: string,
    @Param('productId') productId: string,
  ) {
    try {
      const isItemDeleted =
        await this.sectionProductRelationService.deleteByCondition({
          section_id: sectionId,
          product_id: productId,
        });
      let result = null;
      if (!isItemDeleted) {
        result = Result.ok({
          statusCode: HttpStatus.OK,
          message: 'Cannot delete this item',
        });
      } else {
        result = Result.ok({
          statusCode: HttpStatus.OK,
          message: 'Successfully delete section product item',
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
}
