import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseController } from '../../../BaseController';
import * as express from 'express';
import { Result } from '../../../results/Result';
import { AuthGuard } from '../../../guards';
import { IStaffReportService } from '../service/StaffReportServiceInterface';
import { IUserService } from '../../users/service/UserServiceInterface';
import { GetMinistryOfIndustryAndTradeReportDto } from '../dto/MinistryOfIndustryAndTradeReportDto';
import { FilterReportPerAgentDto } from '../dto/ReportDto';
import { formatCurrency } from '../../../helpers/numberHelper';

@ApiTags('Reports')
@Controller('/v1/reports')
export class StaffReportController extends BaseController {
  constructor(
    @Inject(IStaffReportService)
    private staffReportService: IStaffReportService,
    @Inject(IUserService) private userService: IUserService,
  ) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get Reports' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async getReports(
    @Res() response: express.Response,
    @Req() request: express.Request,
  ) {
    try {
      const isStaffUser = await this.isStaffUser(request.user.id);
      if (!isStaffUser) {
        throw new ForbiddenException({
          statusCode: HttpStatus.FORBIDDEN,
          message: 'User is not staff',
        });
      }
      const reportData = await this.staffReportService.getStaffReports();
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: reportData,
      });
      return this.ok(response, result.value);
    } catch (error) {
      const err = Result.fail({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
      return this.fail(response, err.error);
    }
  }

  @Get('/ministry-of-industry-and-trade')
  @ApiOperation({ summary: 'Get Ministry of Industry and Trade Reports' })
  async getMinistryOfIndustryAndTradeReports(
    @Res() response: express.Response,
    // @Body() getReportDto: GetMinistryOfIndustryAndTradeReportDto,
  ) {
    try {
      const reportData = await this.staffReportService
        .getMinistryOfIndustryAndTradeReports
        // getReportDto,
        ();
      // const result = Result.ok({
      //   statusCode: HttpStatus.OK,
      //   data: reportData,
      // });
      // return this.ok(response, result.value);
      return response.status(200).send(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Báo cáo CARX</title>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
            <link
              href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&display=swap"
              rel="stylesheet"
            />
            <style>
              body {
                font-family: 'Nunito', sans-serif;
              }
              li {
                margin-bottom: 8px;
              }
            </style>
          </head>
          <body style="background-color: #f3f4fb">
            <div style="text-align: center; margin-top: 40px">
              <img
                src="https://agent.carx.asia/static/media/logo.a6595330b857c3d692a4bf5db934eeae.svg"
                width="150"
                alt="logo"
              />
            </div>
            <div
              style="
                margin: 40px auto;
                padding: 20px;
                background-color: white;
                border-radius: 16px;
                max-width: 1000px;
              "
            >
              <h1 style="color: #384adc; text-align: center; font-weight: 700">
                BÁO CÁO
              </h1>
              <ol>
                <li>
                  Số lượng người truy cập: ${formatCurrency(reportData.soLuongTruyCap)} người
                </li>
                <li>Số người bán: ${formatCurrency(reportData.soNguoiBan)} người</li>
                <li>Số người bán mới: ${formatCurrency(reportData.soNguoiBanMoi)} người</li>
                <li>Số sản phẩm mới: ${formatCurrency(reportData.soSanPhamMoi)} sản phẩm</li>
                <li>Tổng số sản phẩm: ${formatCurrency(reportData.tongSoSanPham)} sản phẩm</li>
                <li>Tổng số đơn hàng: ${formatCurrency(reportData.tongSoDonHang)} đơn</li>
                <li>
                  Tổng số đơn hàng thành công:
                  ${formatCurrency(reportData.tongSoDonHangThanhCong)} đơn
                </li>
                <li>
                  Tổng số đơn hàng không thành công:
                  ${formatCurrency(reportData.tongSoDongHangKhongThanhCong)} đơn
                </li>
                <li>
                  Tổng giá trị giao dịch dơn hàng thành công:
                  ${formatCurrency(reportData.tongGiaTriGiaoDichDonHangThanhCong)} VND
                </li>
              </ol>
            </div>
          </body>
        </html>
      `);
    } catch (error) {
      const err = Result.fail({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
      return this.fail(response, err.error);
    }
  }

  @Get('/per-agent/:id')
  @ApiOperation({ summary: 'Get agent detail report' })
  async getReportAgentDetails(
    @Res() response: express.Response,
    @Param('id') agentId: string,
    @Query() getReportDto: FilterReportPerAgentDto,
  ) {
    try {
      const reportData = await this.staffReportService.getReportPerAgent({
        agent_id: agentId,
        ...getReportDto,
      });
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: reportData,
      });
      return this.ok(response, result.value);
    } catch (error) {
      const err = Result.fail({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
      return this.fail(response, err.error);
    }
  }

  @Get('/export-excel/per-agent/:id')
  @ApiOperation({ summary: 'Get export excel report per agent' })
  async exportReportAgentDetails(
    @Res() response: express.Response,
    @Param('id') agentId: string,
    @Query() getReportDto: FilterReportPerAgentDto,
  ) {
    try {
      const exportFileUrl =
        await this.staffReportService.exportExcelReportPerAgent({
          agent_id: agentId,
          ...getReportDto,
        });
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: exportFileUrl,
      });
      return this.ok(response, result.value);
    } catch (error) {
      const err = Result.fail({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
      return this.fail(response, err.error);
    }
  }

  private async isStaffUser(userId: string): Promise<boolean> {
    try {
      const user = await this.userService.getUserDetail(userId, 'public');
      if (!user) {
        throw new Error('User not found');
      }
      if (!user.staff_details) {
        return false;
      }
      return true;
    } catch (error) {
      throw error;
    }
  }
}
