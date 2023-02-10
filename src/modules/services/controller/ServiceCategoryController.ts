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
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseController } from '../../../BaseController';
import { IServiceCategoryService } from '../service/service-categories/ServiceCategoryServiceInterface';
import * as express from 'express';
import {
  CreateServiceCategoryDto,
  FilterServiceCategoryDto,
  UpdateServiceCategoryDto,
} from '../dto/ServiceCategoryDto';
import { Result } from '../../../results/Result';

@ApiTags('Service Categories')
@Controller('/v1/service-categories')
export class ServiceCategoryController extends BaseController {
  constructor(
    @Inject(IServiceCategoryService)
    private readonly serviceCategoriesService: IServiceCategoryService,
  ) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get All Service Categories' })
  async getAllServiceCategories(
    @Res() response: express.Response,
    @Query() getServiceCategoriesDto: FilterServiceCategoryDto,
  ) {
    try {
      const serviceCategories = await this.serviceCategoriesService.getServiceCategoryList(
        getServiceCategoriesDto,
      );
      const total = await this.serviceCategoriesService.countServiceCategoryByCondition(getServiceCategoriesDto);
      const responses = serviceCategories.map(category => {
        let data = category.transformToResponse();
        if (getServiceCategoriesDto.agent_id) {
          delete data.total_service;
          delete data.total_product;
        }
        return data;
      });
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: {
          category_list: responses,
          total: total
        }
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
  @ApiOperation({ summary: 'Get Service Category Detail' })
  async getServiceCategoryDetail(
    @Res() response: express.Response,
    @Param('id') serviceCategoriesId: string,
  ) {
    try {
      const serviceCategories = await this.serviceCategoriesService.getServiceCategoryDetail(serviceCategoriesId);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: serviceCategories.transformToResponse(),
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

//   @Post()
//   @ApiOperation({ summary: 'Create Service Category' })
//   async createNewServiceCategory(
//     @Res() response: express.Response,
//     @Body() createServiceCategoryDto: CreateServiceCategoryDto,
//   ) {
//     try {
//       const createdServiceCategory = await this.serviceCategoriesService.createServiceCategory(
//         createServiceCategoryDto,
//       );
//       const result = Result.ok({
//         statusCode: HttpStatus.OK,
//         data: createdServiceCategory,
//       });
//       return this.ok(response, result.value);
//     } catch (error) {
//       const err = Result.fail({
//         statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
//         message: error.message,
//       });
//       return this.fail(response, err.error);
//     }
//   }

//   @Put(':id')
//   @ApiOperation({ summary: 'Update Service Category' })
//   async updateServiceCategory(
//     @Res() response: express.Response,
//     @Body() updateServiceCategoryDto: UpdateServiceCategoryDto,
//     @Param('id') serviceCategoriesId: string,
//   ) {
//     try {
//       const updatedServiceCategory = await this.serviceCategoriesService.updateServiceCategory(
//         serviceCategoriesId,
//         updateServiceCategoryDto,
//       );
//       const result = Result.ok({
//         statusCode: HttpStatus.OK,
//         data: updatedServiceCategory,
//       });
//       return this.ok(response, result.value);
//     } catch (error) {
//       const err = Result.fail({
//         statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
//         message: error.message,
//       });
//       return this.fail(response, err.error);
//     }
//   }

//   @Delete(':id')
//   @ApiOperation({ summary: 'Delete A Service Category' })
//   async deleteServiceCategory(
//     @Res() response: express.Response,
//     @Param('id') serviceCategoriesId: string,
//   ) {
//     try {
//       await this.serviceCategoriesService.deleteServiceCategory(serviceCategoriesId);
//       const result = Result.ok({
//         statusCode: HttpStatus.OK,
//         message: 'Successfully deleted a service category',
//       });
//       return this.ok(response, result.value);
//     } catch (error) {
//       const err = Result.fail({
//         statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
//         message: error.message,
//       });
//       return this.fail(response, err.error);
//     }
//   }
}
