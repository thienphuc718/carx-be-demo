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
import { Result } from '../../../results/Result';
import { IFeatureService } from '../service/FeatureServiceInterface';

@ApiTags('Features')
@Controller('/v1/features')
export class FeatureController extends BaseController {
  constructor(
    @Inject(IFeatureService) private featureService: IFeatureService,
  ) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get All Features' })
  async getAllFeatures(@Res() response: express.Response) {
    try {
      const features = await this.featureService.getAllFeature();
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: features.map((feature) => feature.transformToResponse()),
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
