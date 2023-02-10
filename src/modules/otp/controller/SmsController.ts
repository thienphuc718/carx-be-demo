import {BaseController} from "../../../BaseController";
import {Controller, Get, HttpStatus, Inject, Query, Res} from "@nestjs/common";
import {ApiOperation, ApiTags} from "@nestjs/swagger";
import {IOtpService} from "../service/OtpServiceInterface";
import {Result} from "../../../results/Result";
import * as express from "express";
import {SmsCallbackQueryDto} from "../dto/OtpDto";

@Controller('/v1/sms')
@ApiTags('SMS')
export class SmsController extends BaseController {
	constructor(@Inject(IOtpService) private otpService: IOtpService) {
		super();
	}

	@Get('/callback')
	@ApiOperation({ summary: 'SMS Callback' })
	async receiveDeliveryReport(
		@Res() response: express.Response,
		@Query() payload: SmsCallbackQueryDto
	) {
		try {
			const smsVendorResponse = await this.otpService.processSmsCallback(payload);
			const result = Result.ok({
				statusCode: HttpStatus.OK,
				message: 'SUCCESS',
				// data: smsVendorResponse
			});
			return this.ok(response, result.value)
		} catch (error) {
			const err = Result.fail({
				statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
				message: error.message,
			});
			return this.fail(response, err.error);
		}
	}
}