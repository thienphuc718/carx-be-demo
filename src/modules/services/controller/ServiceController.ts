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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  EventEmitter2,
} from '@nestjs/event-emitter';
import { BaseController } from '../../../BaseController';
import { IServiceService } from '../service/ServiceServiceInterface';
import { IServiceCategoryService } from '../service/service-categories/ServiceCategoryServiceInterface';

import * as express from 'express';
import {
  FilterServiceDto,
  CreateServicePayloadDto,
  UpdateServicePayloadDto,
} from '../dto/ServiceDto';
import { Result } from '../../../results/Result';
import { AuthGuard } from '../../../guards';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Services')
@Controller('/v1/services')
export class ServiceController extends BaseController {
  constructor(
    @Inject(IServiceService)
    private readonly serviceService: IServiceService,
    private eventEmitter: EventEmitter2,
    @Inject(IServiceCategoryService)
    private readonly serviceCategoriesService: IServiceCategoryService,
  ) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get All Services' })
  async getAllServices(
    @Res() response: express.Response,
    @Query() getServicesDto: FilterServiceDto,
  ) {
    try {
      const [total, services] = await Promise.all([
        this.serviceService.countServiceByCondition(getServicesDto),
        this.serviceService.getServiceList(getServicesDto),
      ]);
      const data = services.map(service => service.transformToResponse());
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: {
          service_list: data,
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

  @Get('/most-viewed')
  @ApiOperation({ summary: 'Get Most Viewed Services' })
  async getMostViewedServices(
    @Res() response: express.Response,
  ) {
    try {
      const services = await this.serviceService.getMostViewCountService();
      const data = services.map(service => service.transformToResponse());
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: {
          service_list: data,
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
  @ApiOperation({ summary: 'Get Service Detail' })
  async getServiceDetail(
    @Res() response: express.Response,
    @Param('id') serviceId: string,
  ) {
    try {
      const service = await this.serviceService.getServiceDetailAndAddViewCount(serviceId);
      if (!service) {
        return this.fail(response, Result.fail({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Service not found'
        }).error)
      }
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: service.transformToResponse(),
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

  @Get('/:id/related-services')
  @ApiOperation({ summary: 'Get Related Services ' })
  async getRelatedService(
    @Res() response: express.Response,
    @Param('id') serviceId: string,
  ) {
    try {
      const [total, services] = await this.serviceService.getRelatedServices(serviceId);
      const data = services.map(service => service.transformToResponse());
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: {
          service_list: data,
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
  @ApiOperation({ summary: 'Create Service' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async createNewService(
    @Res() response: express.Response,
    @Body() createServiceDto: CreateServicePayloadDto,
    @Req() request: express.Request,
  ) {
    try {
      const createdService = await this.serviceService.createService(
        createServiceDto,
        request.user.id,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: createdService.transformToResponse(),
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

  @Post('/:id/view-count')
  @ApiOperation({ summary: 'Add Service View Count' })
  async addService(
    @Res() response: express.Response,
    @Param('id') serviceId: string
  ) {
    try {
      const service = await this.serviceService.addViewCount(serviceId);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: service.transformToResponse(),
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
  // @ApiOperation({ summary: 'Add Service To Service Category' })
  // async addServiceToCategory(
  //   @Res() response: express.Response,
  //   @Body() addServiceToCategoryDto: AddServiceToCategoryDto,
  // ) {
  //   try {
  //     const service = await this.serviceService.addServiceToCategory(
  //       addServiceToCategoryDto,
  //     );
  //     const result = Result.ok({
  //       statusCode: HttpStatus.OK,
  //       data: service,
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

  @Delete('delete')
  @ApiOperation({ summary: 'Delete Services' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async deleteServices(
    @Res() response: express.Response,
    @Body() deleteServiceIds: string[],
  ) {
    try {
      await this.serviceService.deleteMultiServices(deleteServiceIds);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        message: 'Successfully delete services',
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
  @ApiOperation({ summary: 'Update Service' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async updateService(
    @Res() response: express.Response,
    @Body() updateServiceDto: UpdateServicePayloadDto,
    @Param('id') serviceId: string,
  ) {
    try {
      const updatedService = await this.serviceService.updateService(
        serviceId,
        updateServiceDto,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: updatedService.transformToResponse(),
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
  @ApiOperation({ summary: 'Delete A Service' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async deleteService(
    @Res() response: express.Response,
    @Param('id') serviceId: string,
  ) {
    try {
      await this.serviceService.deleteService(serviceId);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        message: 'Successfully deleted a service',
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

  @Post('/bulk-upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Bulk upload services' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async bulkUploadServices(
    @Req() request: express.Request,
    @Res() response: express.Response,
    @UploadedFile() file: Express.Multer.File
  ) {
    try {
      this.eventEmitter.emit(
        'EVENT_SERVICE_BULK_IMPORT',{
          file: file,
          user_id: request.user.id
        },
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        message: 'Successfully import files',
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
