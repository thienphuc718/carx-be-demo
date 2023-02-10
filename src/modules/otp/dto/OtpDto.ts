import {IsInt, IsNotEmpty, IsOptional} from "class-validator";
import {Type} from "class-transformer";

export class SmsCallbackQueryDto {
	@IsOptional()
	smsid?: string

	@IsOptional()
	@Type(() => Number)
	receivedts?: number;

	@IsOptional()
	@Type(() => Number)
	deliveredts?: number;

	@IsOptional()
	@Type(() => Number)
	status?: number;

	@IsOptional()
	user?: string;

	@IsOptional()
	from?: string;

	@IsOptional()
	to?: string;

	@IsOptional()
	@Type(() => Number)
	errorcode?: number;

	@IsOptional()
	text?: string;

	@IsOptional()
	carrier?: string;

	@IsOptional()
	@IsInt()
	@Type(() => Number)
	mnp?: number;
}