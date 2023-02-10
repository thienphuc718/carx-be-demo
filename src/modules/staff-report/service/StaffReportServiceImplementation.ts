import { BadRequestException, Inject } from '@nestjs/common';
import { Op } from 'sequelize';
import {
  getFirstDateOfYear,
  getLastDateOfYear,
} from '../../../helpers/datetimeHelper';
import { IAgentService } from '../../agents/service/AgentServiceInterface';
import { OrderStatusEnum, OrderTypeEnum } from '../../orders/enum/OrderEnum';
import { IOrderService } from '../../orders/service/order/OrderServiceInterface';
import { ProductTypeEnum } from '../../products/enum/ProductEnum';
import { IProductRepository } from '../../products/repository/products/ProductRepositoryInterface';
import { IUserService } from '../../users/service/UserServiceInterface';
import { IFileService } from '../../files/service/FileServiceInterface';
import { ISystemConfigurationService } from '../../system-configurations/service/SystemConfigurationServiceInterface';
import { GetMinistryOfIndustryAndTradeReportDto } from '../dto/MinistryOfIndustryAndTradeReportDto';
import { ReportPerAgent } from '../dto/ReportDto';
import { IStaffReportService } from './StaffReportServiceInterface';
import * as Excel from 'exceljs';
import {IStaffService} from "../../staffs/service/StaffServiceInterface";
import {ICustomerService} from "../../customers/service/customer/CustomerServiceInterface";
import {formatCurrency} from "../../../helpers/numberHelper";

export class StaffReportServiceImplementation implements IStaffReportService {
  constructor(
    @Inject(IUserService)
    private readonly userService: IUserService,
    @Inject(IAgentService)
    private readonly agentService: IAgentService,
    @Inject(IOrderService)
    private readonly orderService: IOrderService,
    @Inject(IFileService)
    private readonly fileService: IFileService,
    @Inject(IProductRepository)
    private readonly productRepository: IProductRepository,
    @Inject(ISystemConfigurationService)
    private readonly systemConfigurationService: ISystemConfigurationService,
    @Inject(IStaffService)
    private readonly staffService: IStaffService,
    @Inject(ICustomerService)
    private readonly customerService: ICustomerService,
  ) {}

  async getStaffReports(): Promise<any> {
    const totalStaff = await this.staffService.countStaffByCondition({ is_deleted: false });

    const totalCustomer = await this.customerService.countCustomerByCondition({ is_deleted: false }, 'public');

    const totalAgent = await this.agentService.countAgentByCondition({
      is_deleted: false,
    });
    const totalRevenue = await this.orderService.sumOrderByCondition({
      is_deleted: false,
      status: OrderStatusEnum.COMPLETED,
    });

    const totalSuccessfulOrder = await this.orderService.countOrderByCondition({
      is_deleted: false,
      status: OrderStatusEnum.COMPLETED,
    });

    const totalProduct = await this.productRepository.countByCondition({
      is_deleted: false,
      type: ProductTypeEnum.PHYSICAL,
    });

    const totalService = await this.productRepository.countByCondition({
      is_deleted: false,
      type: ProductTypeEnum.SERVICE
    });

    const data = {
      total_user: totalCustomer + totalStaff + totalAgent,
      total_agent: totalAgent ?? 0,
      total_revenue: totalRevenue ?? 0,
      total_product: totalProduct ?? 0,
      total_service: totalService ?? 0,
      total_successful_order: totalSuccessfulOrder ?? 0,
      total_fee: 0,
    };
    return data;
  }

  async getMinistryOfIndustryAndTradeReports(
    // payload: GetMinistryOfIndustryAndTradeReportDto,
  ): Promise<any> {
    try {
      // const { username, password } = payload;
      // if (
      //   username !== process.env.REPORT_API_USERNAME &&
      //   password !== process.env.REPORT_API_PASSWORD
      // ) {
      //   throw new BadRequestException('Username or password is incorrect');
      // }

      const currentYear: number = new Date().getFullYear();
      const firstDay = getFirstDateOfYear(currentYear);
      const lastDay = getLastDateOfYear(currentYear);
      const from = `${firstDay}T00:00:00.000Z`;
      const to = `${lastDay}T23:59:59.999Z`;

      const soLuongTruyCap = await this.userService.countUserByCondition(
        {
          updated_at: {
            [Op.gte]: from,
            [Op.lte]: to,
          },
          is_deleted: false,
        },
        'public',
      );

      const soNguoiBan = await this.agentService.countAgentByCondition({
        is_deleted: false,
      });

      const soNguoiBanMoi = await this.agentService.countAgentByCondition({
        is_deleted: false,
        updated_at: {
          [Op.gte]: from,
          [Op.lte]: to,
        },
      });

      const tongSoSanPham = await this.productRepository.countByCondition({
        is_deleted: false,
      });

      const soSanPhamMoi = await this.productRepository.countByCondition({
        is_deleted: false,
        updated_at: {
          [Op.gte]: from,
          [Op.lte]: to,
        },
      });

      const tongSoDonHang = await this.orderService.countOrderByCondition({
        updated_at: {
          [Op.gte]: from,
          [Op.lte]: to,
        },
      });

      const tongSoDonHangThanhCong =
        await this.orderService.countOrderByCondition({
          updated_at: {
            [Op.gte]: from,
            [Op.lte]: to,
          },
          status: OrderStatusEnum.COMPLETED,
        });

      const tongSoDonHangKhongThanhCong =
        await this.orderService.countOrderByCondition({
          updated_at: {
            [Op.gte]: from,
            [Op.lte]: to,
          },
          // status: {
          //   [Op.or]: {
          //     [Op.eq]: OrderStatusEnum.COMPLETED,
          //     [Op.eq]: OrderStatusEnum.REPORTED,
          //   },
          // },
          status: OrderStatusEnum.CANCELLED,
        });

      const tongGiaTriGiaoDichDonHangThanhCong =
        await this.orderService.sumOrderByCondition({
          updated_at: {
            [Op.gte]: from,
            [Op.lte]: to,
          },
          status: OrderStatusEnum.COMPLETED,
        });

      const data = {
        soLuongTruyCap: soLuongTruyCap,
        soNguoiBan: soNguoiBan,
        soNguoiBanMoi: soNguoiBanMoi,
        tongSoSanPham: tongSoSanPham,
        soSanPhamMoi: soSanPhamMoi,
        tongSoDonHang: tongSoDonHang,
        tongSoDonHangThanhCong: tongSoDonHangThanhCong,
        tongSoDongHangKhongThanhCong: tongSoDonHangKhongThanhCong,
        tongGiaTriGiaoDichDonHangThanhCong: tongGiaTriGiaoDichDonHangThanhCong,
      };
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getReportPerAgent(payload: ReportPerAgent): Promise<any> {
    const totalRevenueOfflineOrder = await this.orderService.sumOrderByCondition({
      is_deleted: false,
      agent_id: payload.agent_id,
      start_date: payload.start_date ? payload.start_date : null,
      end_date: payload.end_date ? payload.end_date : null,
      status: OrderStatusEnum.COMPLETED,
      payment_method: 'CASH'
    }) ?? 0;
    const totalRevenueProductOrder = await this.orderService.sumOrderByCondition({
      is_deleted: false,
      agent_id: payload.agent_id,
      start_date: payload.start_date ? payload.start_date : null,
      end_date: payload.end_date ? payload.end_date : null,
      status: OrderStatusEnum.COMPLETED,
      type: OrderTypeEnum.PHYSICAL_PURCHASED
    }) ?? 0;
    const totalRevenueServiceOrder = await this.orderService.sumOrderByCondition({
      is_deleted: false,
      agent_id: payload.agent_id,
      start_date: payload.start_date ? payload.start_date : null,
      end_date: payload.end_date ? payload.end_date : null,
      status: OrderStatusEnum.COMPLETED,
      type: OrderTypeEnum.BOOKING
    }) ?? 0;
    const totalPenaltyFee = 0;
    const totalOrderRevenue = totalRevenueProductOrder + totalRevenueServiceOrder;
    let agentFee = 0;
    const percentFee = await this.systemConfigurationService.getSystemConfigurationDetailByCondition({
      name: 'Phí sàn'
    });
    if (percentFee) {
      agentFee = Math.round((percentFee.apply_value * totalOrderRevenue) / 100)
    }
    return {
      total_revenue_offline_order: totalRevenueOfflineOrder,
      total_revenue_online_order: totalOrderRevenue - totalRevenueOfflineOrder,
      total_revenue_product_order: totalRevenueProductOrder,
      total_revenue_service_order: totalRevenueServiceOrder,
      total_penalty_fee: totalPenaltyFee,
      total_order_revenue: totalOrderRevenue,
      total_actual_revenue: totalOrderRevenue - totalPenaltyFee - agentFee,
      agent_fee: agentFee
    }
  }

  async exportExcelReportPerAgent(payload: ReportPerAgent): Promise<any> {
    try {
      let reportData = await this.getReportPerAgent(payload);
      let orders = await this.orderService.getOrderListByConditionWithoutPaginationUsingQueryBuilder({
        ...payload,
        status: OrderStatusEnum.COMPLETED
      });
      const workbook = new Excel.Workbook();
      const overviewReportSheet = workbook.addWorksheet('Báo cáo tổng quát');
      overviewReportSheet.columns = [
        { header: 'Tên', key: 'name', width: 80 },
        { header: 'Giá trị', key: 'value', width: 30 },
      ];
      overviewReportSheet.addRows([
        ['Tổng phí sàn', formatCurrency(reportData.agent_fee)],
        ['Tổng phí phạt', formatCurrency(reportData.total_penalty_fee)],
        ['Tổng doanh thu online', formatCurrency(reportData.total_revenue_online_order)],
        ['Tổng doanh thu offline', formatCurrency(reportData.total_revenue_offline_order)],
        ['Tổng phí phạt', formatCurrency(reportData.total_penalty_fee)],
        ['Tổng doanh thu của đơn hàng sản phẩm', formatCurrency(reportData.total_revenue_product_order)],
        ['Tổng doanh thu của đơn hàng dịch vụ', formatCurrency(reportData.total_revenue_service_order)],
        ['Tổng doanh thu thực nhận', formatCurrency(reportData.total_actual_revenue)],
      ]);
      overviewReportSheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
        row.eachCell(function(cell, col) {
          cell.alignment = {
            vertical: 'middle', horizontal: 'left'
          };
          if (rowNumber == 1) {
            cell.font = {
              bold: true,
              size: 14,
              color: { argb: 'F79647' },
            };
          }
        })
      })
      const orderReportSheet = workbook.addWorksheet('Đơn hàng');
      orderReportSheet.columns = [
        { header: 'Mã đơn hàng', key: 'id', width: 20 },
        { header: 'Tên sản phẩm', key: 'product_name', width: 40 },
        { header: 'Ngày tạo', key: 'created_at', width: 20 },
        { header: 'Loại đơn', key: 'type', width: 20 },
        { header: 'Giá trị', key: 'value', width: 30 },
      ];
      for(let i = 0; i < orders.length; i++) {
        let order = orders[i];
        orderReportSheet.addRow({
          id: order.order_no,
          product_name: order.items.map(item => `${item.product.name}`).join(', '),
          created_at: order.created_at,
          type: order.type == 'BOOKING' ? 'Dịch vụ' : 'Sản phẩm',
          value: formatCurrency(order.value)
        });
      }
      orderReportSheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
        row.eachCell(function(cell, col) {
          cell.alignment = {
            vertical: 'middle', horizontal: 'left'
          };
          if (rowNumber == 1) {
            cell.font = {
              bold: true,
              size: 14,
              color: { argb: 'F79647' },
            };
          }
        })
      })
      let filePath = 'storage/reports/report_' + payload.agent_id + Date.now() + '.xlsx';
      await workbook.xlsx.writeFile(filePath);
      // let uploadReport = await this.fileService.uploadLocalHostFile(fileName);
      let uploadReport = await this.fileService.uploadLocalHostFileWithCustomFileName(filePath, 'Báo_cáo_doanh_thu')
      if (uploadReport && uploadReport.Location) {
        return uploadReport.Location;
      } else {
        throw new Error('Generate report failed');
      }
    } catch (error) {
      throw error;
    }
  }
}
