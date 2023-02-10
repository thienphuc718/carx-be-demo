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
import { BaseController } from '../../../BaseController';
import { Result } from '../../../results/Result';
import { AuthGuard } from '../../../guards';

import {
  CreateReferralLinkDto,
  FilterReferralLinkDto,
  UpdateReferralLinkDto,
} from '../dto/ReferralLinkDto';
import { IReferralLinkService } from '../service/referral-link/ReferralLinkServiceInterface';

@ApiTags('Referral Links')
@Controller('/v1/referral-links')
@ApiExcludeController()
export class ReferralLinkController extends BaseController {
  constructor(
    @Inject(IReferralLinkService)
    private readonly referralLinkService: IReferralLinkService,
  ) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get All Referral Links' })
  async getAllReferralLinks(
    @Res() response: express.Response,
    @Query() getReferralLinkDto: FilterReferralLinkDto,
    @Req() request: express.Request,
  ) {
    try {
      const referralLinks = await this.referralLinkService.getReferralLinkList(
        getReferralLinkDto,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: referralLinks,
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
  @ApiOperation({ summary: 'Get Referral Link Detail' })
  async getReferralLinkDetail(
    @Res() response: express.Response,
    @Param('id') referralLinkId: string,
    @Req() request: express.Request,
  ) {
    try {
      const referralLink = await this.referralLinkService.getReferralLinkDetail(
        referralLinkId,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: referralLink,
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
  @ApiOperation({ summary: 'Create Referral Link' })
  async createNewReferralLink(
    @Res() response: express.Response,
    @Body() createReferralLinkDto: CreateReferralLinkDto,
    @Req() request: express.Request,
  ) {
    try {
      const createdReferralLink =
        await this.referralLinkService.createReferralLink(
          createReferralLinkDto,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: createdReferralLink,
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
  @ApiOperation({ summary: 'Update Referral Link' })
  async updateReferralLink(
    @Res() response: express.Response,
    @Body() updateReferralLinkDto: UpdateReferralLinkDto,
    @Param('id') referralLinkId: string,
    @Req() request: express.Request,
  ) {
    try {
      const updatedReferralLink =
        await this.referralLinkService.updateReferralLink(
          referralLinkId,
          updateReferralLinkDto,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: updatedReferralLink,
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
  @ApiOperation({ summary: 'Delete A Referral Link' })
  async deleteReferralLink(
    @Res() response: express.Response,
    @Param('id') referralLinkId: string,
    @Req() request: express.Request,
  ) {
    try {
      await this.referralLinkService.deleteReferralLink(referralLinkId);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        message: 'Successfully deleted a referralLink',
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
