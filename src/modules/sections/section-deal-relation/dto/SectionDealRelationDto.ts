import { OmitType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class SectionDealRelationEntityDto {
  @IsNotEmpty()
  @IsUUID(4)
  section_id: string;

  @IsNotEmpty()
  @IsUUID(4)
  deal_id: string;

  @IsOptional()
  order?: number;
}

export class UpdateSectionDealRelationPayloadDto {
  @IsNotEmpty()
  @IsNumber()
  new_order: number;
}

export class CreateSectionDealRelationPayloadDto extends OmitType(
  SectionDealRelationEntityDto,
  ['order'] as const,
) {}
