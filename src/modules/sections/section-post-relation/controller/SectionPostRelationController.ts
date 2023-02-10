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
import { ISectionPostRelationService } from '../service/SectionPostRelationServiceInterface';
import * as express from 'express';
import {
  CreateSectionPostRelationPayloadDto,
  UpdateSectionPostRelationPayloadDto,
} from '../dto/SectionPostRelationDto';
import { Result } from '../../../../results/Result';

@Controller('/v1/section-posts')
@ApiTags('Section Posts')
export class SectionPostRelationController extends BaseController {
  constructor(
    @Inject(ISectionPostRelationService)
    private sectionPostRelationService: ISectionPostRelationService,
  ) {
    super();
  }

  @Post()
  @ApiOperation({ summary: 'Create Section Post Item' })
  @ApiBearerAuth()
  @SetMetadata('permission', CARX_MODULES.USER_INTERFACE)
  @UseGuards(AuthGuard, PermissionGuard)
  async createSectionPostRelation(
    @Res() response: express.Response,
    @Body() sectionPostDto: CreateSectionPostRelationPayloadDto,
  ) {
    try {
      const createdItem = await this.sectionPostRelationService.create(
        sectionPostDto,
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

  @Put('/:sectionId/posts/:postId')
  @ApiOperation({ summary: 'Update Section Post Item Order' })
  @ApiBearerAuth()
  @SetMetadata('permission', CARX_MODULES.USER_INTERFACE)
  @UseGuards(AuthGuard, PermissionGuard)
  async updateSectionPostRelation(
    @Res() response: express.Response,
    @Param('sectionId') sectionId: string,
    @Param('postId') postId: string,
    @Body()
    updateSectionPostRelationDto: UpdateSectionPostRelationPayloadDto,
  ) {
    try {
      const updatedItem =
        await this.sectionPostRelationService.updateByCondition(
          { section_id: sectionId, post_id: postId },
          updateSectionPostRelationDto,
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

  @Delete('/:sectionId/posts/:postId')
  @ApiOperation({ summary: 'Delete Section Post Item' })
  @ApiBearerAuth()
  @SetMetadata('permission', CARX_MODULES.USER_INTERFACE)
  @UseGuards(AuthGuard, PermissionGuard)
  async deleteSectionPostRelation(
    @Res() response: express.Response,
    @Param('sectionId') sectionId: string,
    @Param('postId') postId: string,
  ) {
    try {
      const isItemDeleted =
        await this.sectionPostRelationService.deleteByCondition({
          section_id: sectionId,
          post_id: postId,
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
          message: 'Successfully delete section post item',
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
