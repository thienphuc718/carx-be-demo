import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsOptional,
  IsEnum,
  Max,
  Min,
  IsString,
  IsUUID,
  IsBoolean,
} from 'class-validator';
import { PostTypeEnum, PostVisibilityEnum } from '../enum/PostEnum';

export class FilterPostDto {
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
  limit?: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @ApiPropertyOptional({
    minimum: 1,
    maximum: 10000,
    title: 'Limit',
    format: 'int32',
    default: 1,
  })
  page?: number;

  @IsOptional()
  @IsEnum(PostVisibilityEnum)
  visibility?: PostVisibilityEnum;

  @IsOptional()
  @IsEnum(PostTypeEnum)
  type?: PostTypeEnum;

  @IsOptional()
  @IsUUID(4)
  user_id?: string;

  @IsOptional()
  @IsString()
  title?: string;
}

export class PostEntityDto {
  @IsOptional()
  title?: string;

  @IsOptional()
  slug?: string;

  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsEnum(PostVisibilityEnum)
  visibility?: PostVisibilityEnum;

  @IsOptional()
  external_link?: string;

  @IsNotEmpty()
  @IsEnum(PostTypeEnum)
  type: PostTypeEnum;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsOptional()
  @IsArray()
  meta_tag_value?: string[];

  @IsOptional()
  schema_value?: string;

  @IsNotEmpty()
  @IsUUID(4)
  user_id: string;

  @Transform(({ value }) => [true, 'true'].indexOf(value) > -1)
  @IsOptional()
  @IsBoolean()
  is_top_post?: boolean;

  @IsOptional()
  converted_name?: string;
}

export class CreatePostDto extends OmitType(PostEntityDto, [
  'slug',
  'meta_tag_value',
  'schema_value',
  'is_top_post'
] as const) {}

export class UpdatePostDto extends PartialType(
  OmitType(PostEntityDto, ['slug', 'is_top_post'] as const),
) {}

export class FilterCommunityPostDto extends OmitType(FilterPostDto, [
  'type',
  'user_id'
] as const) {}
