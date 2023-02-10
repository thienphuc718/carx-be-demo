import { PartialType } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class GetCurlPayloadDto {
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsOptional()
  token?: string;

  @IsOptional()
  addheaders?: any
}

export class PostCurlPayloadDto {
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsOptional()
  token?: string;

  @IsNotEmpty()
  data: any
}

export class PutCurlPayloadDto {
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsOptional()
  token: string;

  @IsNotEmpty()
  data: any
}

export class DeleteCurlPayloadDto {
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsOptional()
  token: string;

  @IsNotEmpty()
  data: any
}

export class CustomerHeaderPostCurlPayloadDto {
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsNotEmpty()
  data: any

  @IsOptional()
  header?: any;
}