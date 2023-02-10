import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, Max, Min } from "class-validator";

export class FilterESmsDto {
  @Type(() => Number)
  @IsNumber()
  @Max(50)
  @Min(1)
  limit: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset: number;
}

export class CreateESmsDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  images: string[];
}

export class UpdateESmsDto {
  @IsOptional()
  title: string;

  @IsOptional()
  description: string;

  @IsOptional()
  images: string[];
}
