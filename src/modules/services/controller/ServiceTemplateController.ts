import * as express from 'express';
import {
  Controller,
  Get,
  HttpStatus,
  Inject,
  Query,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseController } from '../../../BaseController';
import { GetListServiceTemplateDto } from '../dto/ServiceTemplateDto';
import { Result } from '../../../results/Result';
import { IServiceTemplateService } from '../service/service-templates/ServiceTemplateServiceInterface';

@Controller('/v1/service-templates')
@ApiTags('Service Templates')
export class ServiceTemplateController extends BaseController {
  constructor(
    @Inject(IServiceTemplateService)
    private serviceTemplateService: IServiceTemplateService,
  ) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get service templates' })
  async getServiceTemplates(
    @Res() response: express.Response,
    @Query() payload: GetListServiceTemplateDto,
  ) {
    try {
      const [count, templates] = await Promise.all([
        this.serviceTemplateService.countTemplateByKeyword(payload.keyword),
        this.serviceTemplateService.getTemplateList(payload),
      ]);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: {
          total: count,
          templates,
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
}
