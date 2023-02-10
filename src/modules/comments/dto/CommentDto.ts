import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Max,
  Min,
  IsString,
  IsBoolean,
  IsDate,
  IsUUID
} from 'class-validator';

export class CommentEntityDto {
  @IsString()
  user_id: string;

  @IsBoolean()
  is_deleted: boolean;

  @IsDate()
  created_at: Date;

  @IsDate()
  updated_at: Date;
}

export class FilterCommentDto {
  @Type(() => Number)
  @IsNumber()
  @Max(200)
  @Min(1)
  @ApiPropertyOptional({
    minimum: 1,
    maximum: 200,
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
  user_id?: string;

  @IsOptional()
  @IsUUID(4)
  post_id?: string;
}

export class CommentPayloadDto extends OmitType(CommentEntityDto, [
  'created_at',
  'updated_at',
] as const) {}

export class CreateCommentPayloadDto extends OmitType(CommentPayloadDto, ['is_deleted'] as const) {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  @IsUUID(4)
  post_id: string;

  @IsString()
  @IsOptional()
  comment_id?: string;
}
