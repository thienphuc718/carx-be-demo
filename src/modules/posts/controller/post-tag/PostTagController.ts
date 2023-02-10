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
import { ApiBearerAuth, ApiOperation, ApiTags, ApiExcludeController } from '@nestjs/swagger';
import { BaseController } from '../../../../BaseController';
import { IPostTagService } from '../../service/post-tag/PostTagServiceInterface';
import * as express from 'express';
import {
  CreatePostTagDto,
  FilterPostTagDto,
  UpdatePostTagDto,
} from '../../dto/PostTagDto';
import { Result } from '../../../../results/Result';
import { AuthGuard } from '../../../../guards';

@ApiTags('Post Tags')
@ApiExcludeController()
@Controller('/v1/post-tags')
export class PostTagController extends BaseController {
  constructor(
    @Inject(IPostTagService) private readonly postTagService: IPostTagService,
  ) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get All PostTags' })
  async getAllPostTags(
    @Res() response: express.Response,
    @Query() getPostTagsDto: FilterPostTagDto,
    @Req() request: express.Request,
  ) {
    try {
      const postTags = await this.postTagService.getPostTagList(getPostTagsDto);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: postTags,
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
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get PostTag Detail' })
  async getPostTagDetail(
    @Res() response: express.Response,
    @Param('id') postTagId: string,
    @Req() request: express.Request,
  ) {
    try {
      const postTag = await this.postTagService.getPostTagDetail(postTagId);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: postTag,
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
  @ApiOperation({ summary: 'Create PostTag' })
  async createNewPostTag(
    @Res() response: express.Response,
    @Body() createPostTagDto: CreatePostTagDto,
    @Req() request: express.Request,
  ) {
    try {
      const createdPostTag = await this.postTagService.createPostTag(
        createPostTagDto,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: createdPostTag,
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
  @ApiOperation({ summary: 'Update PostTag' })
  async updatePostTag(
    @Res() response: express.Response,
    @Body() updatePostTagDto: UpdatePostTagDto,
    @Param('id') postTagId: string,
    @Req() request: express.Request,
  ) {
    try {
      const updatedPostTag = await this.postTagService.updatePostTag(
        postTagId,
        updatePostTagDto,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: updatedPostTag,
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
  @ApiOperation({ summary: 'Delete A PostTag' })
  async deletePostTag(
    @Res() response: express.Response,
    @Param('id') postTagId: string,
    @Req() request: express.Request,
  ) {
    try {
      await this.postTagService.deletePostTag(postTagId);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        message: 'Successfully deleted a postTag',
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
}
