import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseController } from '../../../BaseController';
import * as express from 'express';
import { CreateLikeDto, UpdateLikeDto } from '../dto/LikeDto';
import { ILikeService } from '../service/LikeServiceInterface';
import { Result } from '../../../results/Result';
import { AuthGuard } from '../../../guards';
@Controller('/v1/likes')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('Likes')
export class LikeController extends BaseController {
  constructor(@Inject(ILikeService) private likeService: ILikeService) {
    super();
  }

  @Post('/actions')
  @ApiOperation({ summary: 'Update like model information' })
  async updateLikeInfo (
    @Res() response: express.Response,
    @Body() updateLikeDto: UpdateLikeDto
  ) {
    try {
      const { user_id, post_id, ...rest } = updateLikeDto;
      const isLikeInfoUpdated = await this.likeService.updateByCondition({ user_id: user_id, post_id: post_id }, rest);
      let result = null;
      if (isLikeInfoUpdated) {
        result = Result.ok({
          statusCode: HttpStatus.OK,
          message: 'Update like information successfully',
        });
        return this.ok(response, result.value);
      } else {
        result = Result.fail({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Failed to update like information',
        });
        return this.fail(response, result.error);
      }
    } catch (error) {
      const err = Result.fail({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Cannot update like information',
      });
      return this.fail(response, err.error)
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create Like for a post' })
  async createLike(
    @Res() response: express.Response,
    @Body() createLikeDto: CreateLikeDto,
  ) {
    try {
      const createdLike = await this.likeService.createLike(createLikeDto);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: createdLike,
      });
      return this.ok(response, result.value);
    } catch (error) {
      const err = Result.fail({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Cannot create like',
      });
      return this.fail(response, err.error);
    }
  }
}
