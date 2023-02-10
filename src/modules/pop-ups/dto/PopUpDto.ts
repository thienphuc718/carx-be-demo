import { OmitType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class PopUpEntityDto {
  @IsOptional()
  @IsString()
  image?: string;

  @Transform(({ value }) => {
    return [true, 'true'].indexOf(value) > -1;
  })
  @IsOptional()
  @IsBoolean()
  is_hidden?: boolean;

  @Transform(({ value }) => {
    return [true, 'true'].indexOf(value) > -1;
  })
  @IsOptional()
  @IsBoolean()
  is_deleted?: boolean;

  @IsOptional()
  @IsDate()
  created_at?: Date;

  @IsOptional()
  @IsDate()
  updated_at?: Date;
}

export class UpdatePopUpPayloadDto extends OmitType(PopUpEntityDto, [
  'created_at',
  'updated_at',
  'is_deleted',
] as const) {}

export class CreatePopUpPayloadDto extends OmitType(PopUpEntityDto, [
  'created_at',
  'updated_at',
  'is_deleted',
  'is_hidden',
] as const) {
  @IsNotEmpty()
  @IsString()
  image: string;
}
