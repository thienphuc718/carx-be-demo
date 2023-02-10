import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { ChatMessageTypeEnum } from '../enum/ChatEnum';

export class MessageDataDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsEnum(ChatMessageTypeEnum)
  type: ChatMessageTypeEnum;
}
export class ChatMessageEntityDto {
  @IsNotEmpty()
  @IsUUID(4)
  sender_id: string;

  @IsNotEmpty()
  @IsUUID(4)
  receiver_id: string;

  @IsNotEmpty()
  @IsUUID(4)
  conversation_id: string;

  @IsNotEmpty()
  @IsObject()
  message: MessageDataDto;

  @Transform(({ value }) => {
    return [true, 'true'].indexOf(value) > -1;
  })
  @IsOptional()
  @IsBoolean()
  is_deleted: boolean;
}

export class FilterChatMessageDto {
  @Type(() => Number)
  @IsNumber()
  @Max(50)
  @Min(1)
  @ApiPropertyOptional({
    minimum: 1,
    maximum: 50,
    title: 'Limit',
    format: 'int32',
    default: 10,
  })
  limit: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @ApiPropertyOptional({
    minimum: 1,
    title: 'Page',
    format: 'int32',
    default: 1,
  })
  page: number;

  @IsOptional()
  @IsUUID(4)
  sender_id?: string;

  @IsNotEmpty()
  @IsUUID(4)
  conversation_id: string;
}

export class CreateChatMessageDto extends OmitType(ChatMessageEntityDto, ['is_deleted'] as const) {}
