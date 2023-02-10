import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseController } from '../../../BaseController';
import * as express from 'express';
import { Result } from '../../../results/Result';
import { AuthGuard } from '../../../guards';
import { IActivityService } from '../service/ActivityServiceInteface';
import {
  CreateActivityDto,
  FilterActivityDto,
  UpdateActivityDto,
} from '../dto/ActivityDto';

@ApiTags('Activities')
@Controller('/v1/activities')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class ActivityController extends BaseController {
  constructor(
    @Inject(IActivityService) private activityService: IActivityService,
  ) {
    super();
  }

  @Get('')
  @ApiOperation({ summary: 'Get All Activities' })
  async getActivityList(
    @Res() response: express.Response,
    @Query() query: FilterActivityDto,
  ) {
    try {
      const activities = await this.activityService.getActivityList(query);
      const total = await this.activityService.countActivityByCondition(query);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: {
          activities: activities,
          total: total,
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
  @ApiOperation({ summary: 'Get Activity Detail' })
  async getActivityDetail(
    @Res() response: express.Response,
    @Param('id') id: string,
  ) {
    try {
      const activity = await this.activityService.getActivityDetail(id);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: activity,
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

  // @Post()
  // @ApiOperation({ summary: 'Create Activity' })
  // async createActivity(
  //   @Res() response: express.Response,
  //   @Body() payload: CreateActivityDto,
  // ) {
  //   try {
  //     const createdActivity = await this.activityService.createActivity(
  //       payload,
  //     );
  //     const result = Result.ok({
  //       statusCode: HttpStatus.OK,
  //       data: createdActivity,
  //     });
  //     return this.ok(response, result.value);
  //   } catch (error) {
  //     const err = Result.fail({
  //       statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  //       message: error.message,
  //     });
  //     return this.fail(response, err.error);
  //   }
  // }

  // @Put(':id')
  // @ApiOperation({ summary: 'Update Review' })
  // async updateRole(
  //   @Res() response: express.Response,
  //   @Body() payload: UpdateActivityDto,
  //   @Param('id') reviewId: string,
  // ) {
  //   try {
  //     const updatedActivity = await this.activityService.updateActivity(
  //       reviewId,
  //       payload,
  //     );
  //     const result = Result.ok({
  //       statusCode: HttpStatus.OK,
  //       message: 'Activity updated',
  //       data: updatedActivity,
  //     });
  //     return this.ok(response, result.value);
  //   } catch (error) {
  //     const err = Result.fail({
  //       statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  //       message: error.message,
  //     });
  //     return this.fail(response, err.error);
  //   }
  // }
}
