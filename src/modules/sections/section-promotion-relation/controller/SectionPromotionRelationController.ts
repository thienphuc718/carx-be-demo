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
import { ISectionPromotionRelationService } from '../service/SectionPromotionRelationServiceInterface';
import * as express from 'express';
import {
  CreateSectionPromotionRelationPayloadDto,
  UpdateSectionPromotionRelationPayloadDto,
} from '../dto/SectionPromotionRelationDto';
import { Result } from '../../../../results/Result';

@Controller('/v1/section-promotions')
@ApiTags('Section Promotions')
export class SectionPromotionRelationController extends BaseController {
  constructor(
    @Inject(ISectionPromotionRelationService)
    private sectionPromotionRelationService: ISectionPromotionRelationService,
  ) {
    super();
  }

  @Post()
  @ApiOperation({ summary: 'Create Section Promotion Item' })
  @ApiBearerAuth()
  @SetMetadata('permission', CARX_MODULES.USER_INTERFACE)
  @UseGuards(AuthGuard, PermissionGuard)
  async createSectionPromotionRelation(
    @Res() response: express.Response,
    @Body() sectionPromotionDto: CreateSectionPromotionRelationPayloadDto,
  ) {
    try {
      const createdItem = await this.sectionPromotionRelationService.create(
        sectionPromotionDto,
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

  @Put('/:sectionId/promotions/:promotionId')
  @ApiOperation({ summary: 'Update Section Promotion Item Order' })
  @ApiBearerAuth()
  @SetMetadata('permission', CARX_MODULES.USER_INTERFACE)
  @UseGuards(AuthGuard, PermissionGuard)
  async updateSectionPromotionRelation(
    @Res() response: express.Response,
    @Param('sectionId') sectionId: string,
    @Param('promotionId') promotionId: string,
    @Body()
    updateSectionPromotionRelationDto: UpdateSectionPromotionRelationPayloadDto,
  ) {
    try {
      const updatedItem =
        await this.sectionPromotionRelationService.updateByCondition(
          { section_id: sectionId, promotion_id: promotionId },
          updateSectionPromotionRelationDto,
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

  @Delete('/:sectionId/promotions/:promotionId')
  @ApiOperation({ summary: 'Delete Section Promotion Item' })
  @ApiBearerAuth()
  @SetMetadata('permission', CARX_MODULES.USER_INTERFACE)
  @UseGuards(AuthGuard, PermissionGuard)
  async deleteSectionPromotionRelation(
    @Res() response: express.Response,
    @Param('sectionId') sectionId: string,
    @Param('promotionId') promotionId: string,
  ) {
    try {
      const isItemDeleted =
        await this.sectionPromotionRelationService.deleteByCondition({
          section_id: sectionId,
          promotion_id: promotionId,
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
          message: 'Successfully delete section promotion item',
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
