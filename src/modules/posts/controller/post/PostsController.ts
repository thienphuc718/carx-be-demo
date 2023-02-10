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
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiExcludeController,
} from '@nestjs/swagger';
import * as express from 'express';
import { BaseController } from '../../../../BaseController';
import { Result } from '../../../../results/Result';
import { AuthGuard } from '../../../../guards';
import { IPostService } from '../../service/post/PostServiceInterface';
import { CreatePostDto, FilterCommunityPostDto, FilterPostDto, UpdatePostDto } from '../../dto/PostDto';
import { PostTypeEnum } from '../../enum/PostEnum';

@ApiTags('Posts')
// @ApiExcludeController()
@Controller('/v1/posts')
export class PostController extends BaseController {
  constructor(
    @Inject(IPostService) private readonly postService: IPostService,
  ) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get All Posts' })
  async getAllPosts(
    @Res() response: express.Response,
    @Query() getPostsDto: FilterPostDto,
    @Req() request: express.Request,
  ) {
    try {
      const posts = await this.postService.getPostList(getPostsDto);
      const total = await this.postService.countPostByCondition(getPostsDto);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: {
          post_list: posts,
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

  @Get('/communities')
  @ApiOperation({ summary: 'Get All Community Posts' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async getAllCommunityPosts(
    @Res() response: express.Response,
    @Query() getPostsDto: FilterCommunityPostDto,
    @Req() request: express.Request,
  ) {
    try {
      const userId = request.user.id;    
      const posts = await this.postService.getCommunityPostList(getPostsDto, userId);
      const total = await this.postService.countPostByCondition({ ...getPostsDto, type: PostTypeEnum.USER_POST });
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: {
          post_list: posts.map(post => post.transformToCommunityPostResponse(userId)),
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
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get Post Detail' })
  async getPostDetail(
    @Res() response: express.Response,
    @Param('id') postId: string,
    @Req() request: express.Request,
  ) {
    try {
      const userId = request.user.id;
      if (!userId) {
        throw new Error('User not found');
      }
      const post = await this.postService.getPostDetail(postId);
      if (!post) {
        return this.fail(response, {
          message: 'Post not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: post.transformToCommunityPostResponse(userId),
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
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create Post' })
  async createNewPost(
    @Res() response: express.Response,
    @Body() createPostDto: CreatePostDto,
    @Req() request: express.Request,
  ) {
    try {
      const createdPost = await this.postService.createPost(createPostDto);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: createdPost,
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

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update Post' })
  async updatePost(
    @Res() response: express.Response,
    @Body() updatePostDto: UpdatePostDto,
    @Param('id') postId: string,
    @Req() request: express.Request,
  ) {
    try {
      const updatedPost = await this.postService.updatePost(
        postId,
        updatePostDto,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: updatedPost,
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

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete A Post' })
  async deletePost(
    @Res() response: express.Response,
    @Param('id') postId: string,
    @Req() request: express.Request,
  ) {
    try {
      await this.postService.deletePost(postId);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        message: 'Successfully deleted a post',
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
