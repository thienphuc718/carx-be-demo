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
import { ISectionDealRelationService } from '../service/SectionDealRelationServiceInterface';
import * as express from 'express';
import {
  CreateSectionDealRelationPayloadDto,
  UpdateSectionDealRelationPayloadDto,
} from '../dto/SectionDealRelationDto';
import { Result } from '../../../../results/Result';

@Controller('/v1/section-deals')
@ApiTags('Section Deals')
export class SectionDealRelationController extends BaseController {
  constructor(
    @Inject(ISectionDealRelationService)
    private sectionDealRelationService: ISectionDealRelationService,
  ) {
    super();
  }

  @Post()
  @ApiOperation({ summary: 'Create Section Deal Item' })
  @ApiBearerAuth()
  @SetMetadata('permission', CARX_MODULES.USER_INTERFACE)
  @UseGuards(AuthGuard, PermissionGuard)
  async createSectionDealRelation(
    @Res() response: express.Response,
    @Body() sectionDealDto: CreateSectionDealRelationPayloadDto,
  ) {
    try {
      const createdItem =
        await this.sectionDealRelationService.createSectionDealRelation(
          sectionDealDto,
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

  @Put('/:sectionId/deals/:dealId')
  @ApiOperation({ summary: 'Update Section Deal Item Order' })
  @ApiBearerAuth()
  @SetMetadata('permission', CARX_MODULES.USER_INTERFACE)
  @UseGuards(AuthGuard, PermissionGuard)
  async updateSectionDealRelation(
    @Res() response: express.Response,
    @Param('sectionId') sectionId: string,
    @Param('dealId') dealId: string,
    @Body()
    updateSectionDealRelationDto: UpdateSectionDealRelationPayloadDto,
  ) {
    try {
      const updatedItem =
        await this.sectionDealRelationService.updateByCondition(
          { section_id: sectionId, deal_id: dealId },
          updateSectionDealRelationDto,
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

  @Delete('/:sectionId/deals/:dealId')
  @ApiOperation({ summary: 'Delete Section Deal Item' })
  @ApiBearerAuth()
  @SetMetadata('permission', CARX_MODULES.USER_INTERFACE)
  @UseGuards(AuthGuard, PermissionGuard)
  async deleteSectionDealRelation(
    @Res() response: express.Response,
    @Param('sectionId') sectionId: string,
    @Param('dealId') dealId: string,
  ) {
    try {
      const isItemDeleted =
        await this.sectionDealRelationService.deleteByCondition({
          section_id: sectionId,
          deal_id: dealId,
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
          message: 'Successfully delete section deal item',
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
