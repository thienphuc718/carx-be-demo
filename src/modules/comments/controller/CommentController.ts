import {
  Body,
  Controller,
  Delete,
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
import {
  ApiOperation,
  ApiTags,
  ApiExcludeController,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BaseController } from '../../../BaseController';
import { ICommentService } from '../service/CommentServiceInterface';
import * as express from 'express';
import { CreateCommentPayloadDto, FilterCommentDto } from '../dto/CommentDto';
import { Result } from '../../../results/Result';
import { AuthGuard } from '../../../guards';

@ApiTags('Comments')
// @ApiExcludeController()
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('/v1/comments')
export class CommentController extends BaseController {
  constructor(
    @Inject(ICommentService)
    private readonly commentService: ICommentService,
  ) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get comment list'})
  async getCommentList(
    @Res() response: express.Response,
    @Query() getCommentListDto: FilterCommentDto,
  ) {
    try {
      const comments = await this.commentService.getCommentListByCondition(getCommentListDto);
      const total = await this.commentService.countCommentByCondition(getCommentListDto);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: {
          comment_list: comments,
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

  @Post()
  @ApiOperation({ summary: 'Add comment' })
  async createComment(
    @Res() response: express.Response,
    @Body() createCommentDto: CreateCommentPayloadDto,
  ) {
    try {
      const createdComment = await this.commentService.createComment(
        createCommentDto,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: createdComment.transformToResponse(),
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
}
