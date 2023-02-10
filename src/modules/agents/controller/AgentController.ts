import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpStatus,
  Inject,
  Param,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import * as express from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseController } from '../../../BaseController';
import { Result } from '../../../results/Result';
import { IAgentService } from '../service/AgentServiceInterface';
import {
  ActivateAgentDto,
  FilterAgentDto,
  HideAgentDto,
  UpdateAgentEntityDto,
} from '../dto/AgentDto';
import { AuthGuard } from '../../../guards';
import { IUserService } from '../../users/service/UserServiceInterface';
// import { normalizeString } from '../../../helpers/stringHelper';

@ApiTags('Agents')
@Controller('/v1/agents')
// @ApiBearerAuth()
// @UseGuards(AuthGuard)
export class AgentController extends BaseController {
  constructor(
    @Inject(IAgentService) private agentService: IAgentService,
    // @Inject(IGoongService) private goongService: IGoongService,
    @Inject(IUserService) private userService: IUserService,
  ) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get agent list' })
  async getAgentList(
    @Res() response: express.Response,
    @Req() request: express.Request,
    @Query() filterAgentDto: FilterAgentDto,
  ) {
    try {
      const { latitude, longitude, distance, ...rest } = filterAgentDto;
      let agents = [];
      let totalAgents = 0;
      if (latitude && longitude && distance) {
        agents = await this.agentService.getAgentListByDistance(filterAgentDto);
        totalAgents = await this.agentService.countAgentByDistance(
          filterAgentDto,
        );
      } else {
        agents = await this.agentService.getAgentList(filterAgentDto);
        totalAgents = await this.agentService.countAgentByCondition(
          filterAgentDto,
        );
      }

      const agentResponse = agents.map((agent) => agent.transformToResponse());
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: {
          agent_list: agentResponse,
          total: totalAgents,
        },
      });

      return this.ok(response, result.value);
    } catch (error) {
      console.log(error);

      const err = Result.fail({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
      return this.fail(response, err.error);
    }
  }

  // @Get("/update-geo-location")
  // @ApiOperation({ summary: 'Update Geo location' })
  // async updateGeoLocation(
  //   @Res() response: express.Response,
  //   @Req() request: express.Request,
  //   @Query() filterAgentDto: FilterAgentDto
  // ) {
  //   try {
  //     const agents = await this.agentService.getAgentList(filterAgentDto);
  //
  //     for (let i = 0; i < agents.length; i++) {
  //       const agent = agents[i];
  //       if (agent.address) {
  //         const { data } = await this.goongService.getGeoLocation(agent.address);
  //         const { results } = data;
  //         const { geometry } = results[0]
  //
  //         this.agentService.updateAgent(agent.id, {
  //           geo_info: results,
  //           longitude: geometry.location.lng,
  //           latitude: geometry.location.lat
  //         })
  //       }
  //     }
  //
  //     return this.ok(response);
  //     // return this.ok(response, result.value);
  //   } catch (error) {
  //     console.log(error);
  //
  //     const err = Result.fail({
  //       statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  //       message: error.message,
  //     });
  //     return this.fail(response, err.error);
  //   }
  // }

  @Get(':id')
  @ApiOperation({ summary: 'Get agent details' })
  async getAgentDetails(
    @Res() response: express.Response,
    @Param('id') agentId: string,
  ) {
    try {
      const agent = await this.agentService.getAgentDetails(agentId);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: agent.transformToResponse(),
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

  @Get('/:id/revenue')
  @ApiOperation({ summary: 'Get agent revenue' })
  async getAgentRevenue(
    @Res() response: express.Response,
    @Param('id') agentId: string,
  ) {
    try {
      const data = await this.agentService.getAgentRevenue(agentId);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: data,
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
  @ApiOperation({ summary: 'Update agent info' })
  async updateAgentInfo(
    @Res() response: express.Response,
    @Param('id') agentId: string,
    @Body() payload: UpdateAgentEntityDto,
  ) {
    try {
      const [_, updatedAgents] = await this.agentService.updateAgent(
        agentId,
        payload,
      );

      if (payload.address) {
        await this.agentService.updateGeoLocation(agentId, payload.address);
      }
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: updatedAgents[0].transformToResponse(),
      });
      return this.ok(response, result.value);
    } catch (error) {
      const err = Result.fail({
        statusCode: error.code ? HttpStatus.BAD_REQUEST : HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
        errorCode: error.code,
        data: error.value
      });
      return this.fail(response, err.error);
    }
  }

  @Put(':id/hide')
  @ApiOperation({ summary: 'Hide/Unhide agent' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async hideOrUnhideAgent(
    @Res() response: express.Response,
    @Param('id') agentId: string,
    @Body() payload: HideAgentDto,
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
      const isAgentHidden = await this.agentService.hideOrUnhideAgent(
        agentId,
        payload.is_hidden,
      );
      let result = null;
      if (!isAgentHidden) {
        result = Result.fail({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Failed to hide or unhide agent',
        });
      } else {
        result = Result.ok({
          statusCode: HttpStatus.OK,
          message: 'Successfully hid agent',
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

  @Put(':id/activate')
  @ApiOperation({ summary: 'Activate/Deactivate agent' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async activateOrDeactivateAgent(
    @Res() response: express.Response,
    @Param('id') agentId: string,
    @Body() payload: ActivateAgentDto,
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
      const isAgentHidden = await this.agentService.activateOrDeactivateAgent(
        agentId,
        payload.is_activated,
      );
      let result = null;
      if (!isAgentHidden) {
        result = Result.fail({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Failed to activate or deactivate agent',
        });
      } else {
        result = Result.ok({
          statusCode: HttpStatus.OK,
          message: 'Successfully activate or deactivate agent',
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
