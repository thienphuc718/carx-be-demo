import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseController } from '../../../BaseController';
import { AuthGuard } from '../../../guards';
import { IAgentCategoryService } from '../service/AgentCategoryServiceInterface';
import * as express from 'express';
import { Result } from '../../../results/Result';
import {
  CreateAgentCategoryDto,
  FilterAgentCategoryDto,
  UpdateAgentCategoryDto,
} from '../dto/AgentCategoryDto';
import { IUserService } from '../../users/service/UserServiceInterface';

@Controller('v1/agent-categories')
@ApiTags('Agent Categories')
export class AgentCategoryController extends BaseController {
  constructor(
    @Inject(IAgentCategoryService)
    private agentCategoryService: IAgentCategoryService,
    @Inject(IUserService)
    private userService: IUserService,
  ) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get All Agent Categories' })
  async getAgentCategoryList(
    @Res() response: express.Response,
    @Query() payload: FilterAgentCategoryDto,
  ) {
    try {
      const agentCategories =
        await this.agentCategoryService.getAgentCategoryList(payload);
      const total =
        await this.agentCategoryService.countAgentCategoryByCondition(payload);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: {
          agent_category_list: agentCategories,
          total: total,
        },
      });
      return this.ok(response, result.value);
    } catch (error) {
      const result = Result.fail({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
      return this.fail(response, result.error);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Agent Category Detail' })
  async getAgentCategoryDetail(
    @Res() response: express.Response,
    @Param('id') agentCategoryId: string,
  ) {
    try {
      const agentCategory =
        await this.agentCategoryService.getAgentCategoryDetail(agentCategoryId);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: agentCategory,
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
  @ApiOperation({ summary: 'Create Agent Category' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async createNewAgentCategory(
    @Res() response: express.Response,
    @Body() createAgentCategoryDto: CreateAgentCategoryDto,
    @Req() request: express.Request,
  ) {
    try {
      const isStaffUser = await this.isStaffUser(request.user.id);
      if (!isStaffUser) {
        throw new ForbiddenException({
          statusCode: HttpStatus.FORBIDDEN,
          message: 'User is not staff',
        });
      }
      const createdAgentCategory =
        await this.agentCategoryService.createAgentCategory(
          createAgentCategoryDto,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: createdAgentCategory,
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
  @ApiOperation({ summary: 'Update Agent Category' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async updateAgentCategory(
    @Res() response: express.Response,
    @Body() updateAgentCategoryDto: UpdateAgentCategoryDto,
    @Param('id') agentCategoryId: string,
    @Req() request: express.Request,
  ) {
    try {
      const isStaffUser = await this.isStaffUser(request.user.id);
      if (!isStaffUser) {
        throw new ForbiddenException({
          statusCode: HttpStatus.FORBIDDEN,
          message: 'User is not staff',
        });
      }
      const updatedAgentCategory =
        await this.agentCategoryService.updateAgentCategory(
          agentCategoryId,
          updateAgentCategoryDto,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: updatedAgentCategory,
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
  @ApiOperation({ summary: 'Delete An Agent Category' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async deleteAgentCategory(
    @Res() response: express.Response,
    @Param('id') agentCategoryId: string,
    @Req() request: express.Request,
  ) {
    try {
      const isStaffUser = await this.isStaffUser(request.user.id);
      if (!isStaffUser) {
        throw new ForbiddenException({
          statusCode: HttpStatus.FORBIDDEN,
          message: 'User is not staff',
        });
      }
      await this.agentCategoryService.deleteAgentCategory(agentCategoryId);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        message: 'Successfully deleted an Agent Category',
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

  private async isStaffUser(userId: string): Promise<boolean> {
    try {
      const user = await this.userService.getUserDetail(userId, 'public');
      if (!user) {
        throw new Error('User not found');
      }
      if (!user.staff_details) {
        return false;
      }
      return true;
    } catch (error) {
      throw error;
    }
  }
}
