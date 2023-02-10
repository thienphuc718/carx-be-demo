import { OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class SectionPromotionRelationEntityDto {
  @IsNotEmpty()
  @IsUUID(4)
  section_id: string;

  @IsNotEmpty()
  @IsUUID(4)
  promotion_id: string;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  order?: number;
}

export class UpdateSectionPromotionRelationPayloadDto {
  @IsNotEmpty()
  @IsNumber()
  new_order: number;
}

export class CreateSectionPromotionRelationPayloadDto extends OmitType(
  SectionPromotionRelationEntityDto,
  [] as const,
) {}
