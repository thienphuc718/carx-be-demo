import { IsNotEmpty, IsString } from 'class-validator';

export class GetMinistryOfIndustryAndTradeReportDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
