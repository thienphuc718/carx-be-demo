import { IsNotEmpty, IsString, IsUUID, IsDateString, IsOptional } from 'class-validator';
import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';

export class ReportPerAgent {
  @IsUUID(4)
  agent_id?: string;

  @IsDateString()
  @IsOptional()
  start_date?: string;

  @IsDateString()
  @IsOptional()
  end_date?: string;
}

export class FilterReportPerAgentDto extends OmitType(ReportPerAgent, [
  'agent_id',
] as const) {}
