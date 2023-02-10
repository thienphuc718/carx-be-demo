import { GetMinistryOfIndustryAndTradeReportDto } from "../dto/MinistryOfIndustryAndTradeReportDto";
import { ReportPerAgent } from '../dto/ReportDto';

export interface IStaffReportService {
  getStaffReports(): Promise<any>;
  getReportPerAgent(payload: ReportPerAgent): Promise<any>;
  getMinistryOfIndustryAndTradeReports(): Promise<any>;
  exportExcelReportPerAgent(payload: ReportPerAgent): Promise<any>;
}

export const IStaffReportService = Symbol('IStaffReportService');
