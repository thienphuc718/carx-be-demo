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
import { ISectionAgentRelationService } from '../service/SectionAgentRelationServiceInterface';
import * as express from 'express';
import {
  CreateSectionAgentRelationPayloadDto,
  UpdateSectionAgentRelationPayloadDto,
} from '../dto/SectionAgentRelationDto';
import { Result } from '../../../../results/Result';

@Controller('/v1/section-agents')
@ApiTags('Section Agents')
export class SectionAgentRelationController extends BaseController {
  constructor(
    @Inject(ISectionAgentRelationService)
    private sectionAgentRelationService: ISectionAgentRelationService,
  ) {
    super();
  }

  @Post()
  @ApiOperation({ summary: 'Create Section Agent Item' })
  @ApiBearerAuth()
  @SetMetadata('permission', CARX_MODULES.USER_INTERFACE)
  @UseGuards(AuthGuard, PermissionGuard)
  async createSectionAgentRelation(
    @Res() response: express.Response,
    @Body() sectionAgentDto: CreateSectionAgentRelationPayloadDto,
  ) {
    try {
      const createdItem = await this.sectionAgentRelationService.create(
        sectionAgentDto,
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

  @Put('/:sectionId/agents/:agentId')
  @ApiOperation({ summary: 'Update Section Agent Item Order' })
  @ApiBearerAuth()
  @SetMetadata('permission', CARX_MODULES.USER_INTERFACE)
  @UseGuards(AuthGuard, PermissionGuard)
  async updateSectionAgentRelation(
    @Res() response: express.Response,
    @Param('sectionId') sectionId: string,
    @Param('agentId') agentId: string,
    @Body()
    updateSectionAgentRelationDto: UpdateSectionAgentRelationPayloadDto,
  ) {
    try {
      const updatedItem =
        await this.sectionAgentRelationService.updateByCondition(
          { section_id: sectionId, agent_id: agentId },
          updateSectionAgentRelationDto,
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

  @Delete('/:sectionId/agents/:agentId')
  @ApiOperation({ summary: 'Delete Section Agent Item' })
  @ApiBearerAuth()
  @SetMetadata('permission', CARX_MODULES.USER_INTERFACE)
  @UseGuards(AuthGuard, PermissionGuard)
  async deleteSectionAgentRelation(
    @Res() response: express.Response,
    @Param('sectionId') sectionId: string,
    @Param('agentId') agentId: string,
  ) {
    try {
      const isItemDeleted =
        await this.sectionAgentRelationService.deleteByCondition({
          section_id: sectionId,
          agent_id: agentId,
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
          message: 'Successfully delete section agent item',
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
