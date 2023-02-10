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
import * as express from 'express';
import { BaseController } from '../../../../BaseController';
import { Result } from '../../../../results/Result';
import { AuthGuard } from '../../../../guards';
import { IPostCategoryService } from '../../service/post-category/PostCategoryServiceInterface';
import {
  CreatePostCategoryDto,
  FilterPostCategoryDto,
  UpdatePostCategoryDto,
} from '../../dto/PostCategoryDto';

@ApiTags('Post Categories')
@ApiExcludeController()
@Controller('/v1/post-categories')
export class PostCategoryController extends BaseController {
  constructor(
    @Inject(IPostCategoryService)
    private readonly postCategoryService: IPostCategoryService,
  ) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get All PostCategories' })
  async getAllPostCategories(
    @Res() response: express.Response,
    @Query() getPostCategoriesDto: FilterPostCategoryDto,
    @Req() request: express.Request,
  ) {
    try {
      const postCategories = await this.postCategoryService.getPostCategoryList(
        getPostCategoriesDto,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: postCategories,
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
  @ApiOperation({ summary: 'Get PostCategory Detail' })
  async getPostCategoryDetail(
    @Res() response: express.Response,
    @Param('id') postCategoryId: string,
    @Req() request: express.Request,
  ) {
    try {
      const postCategory = await this.postCategoryService.getPostCategoryDetail(
        postCategoryId,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: postCategory,
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
  @ApiOperation({ summary: 'Create PostCategory' })
  async createNewPostCategory(
    @Res() response: express.Response,
    @Body() createPostCategoryDto: CreatePostCategoryDto,
    @Req() request: express.Request,
  ) {
    try {
      const createdPostCategory =
        await this.postCategoryService.createPostCategory(
          createPostCategoryDto,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: createdPostCategory,
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
  @ApiOperation({ summary: 'Update PostCategory' })
  async updatePostCategory(
    @Res() response: express.Response,
    @Body() updatePostCategoryDto: UpdatePostCategoryDto,
    @Param('id') postCategoryId: string,
    @Req() request: express.Request,
  ) {
    try {
      const updatedPostCategory =
        await this.postCategoryService.updatePostCategory(
          postCategoryId,
          updatePostCategoryDto,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: updatedPostCategory,
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
  @ApiOperation({ summary: 'Delete A PostCategory' })
  async deletePostCategory(
    @Res() response: express.Response,
    @Param('id') postCategoryId: string,
    @Req() request: express.Request,
  ) {
    try {
      await this.postCategoryService.deletePostCategory(postCategoryId);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        message: 'Successfully deleted a postCategory',
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
