import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { format, parse, startOfDay } from 'date-fns';
import { Op } from 'sequelize';
import { exportAgentFields, parseCsvData } from '../helpers/exportDataHelper';
import { EmailClientOptionEnum } from '../modules/email/enum/EmailEnum';
import { IEmailService } from '../modules/email/service/EmailServiceInterface';
import { IFileService } from '../modules/files/service/FileServiceInterface';
import { IUserService } from '../modules/users/service/UserServiceInterface';
import { FolderEnum } from '../modules/files/enum/FileEnum';
import { IOrderService } from '../modules/orders/service/order/OrderServiceInterface';
import { IAgentService } from '../modules/agents/service/AgentServiceInterface';
import { IPromotionService } from '../modules/promotions/service/promotion/PromotionServiceInterface';
import { PromotionStatusEnum } from '../modules/promotions/enum/PromotionEnum';
import { OrderStatusEnum } from '../modules/orders/enum/OrderEnum';
import { ICustomerService } from '../modules/customers/service/customer/CustomerServiceInterface';
import { ISystemConfigurationService } from '../modules/system-configurations/service/SystemConfigurationServiceInterface';
import {utcToZonedTime, zonedTimeToUtc} from 'date-fns-tz';
import { IServiceService } from '../modules/services/service/ServiceServiceInterface';
import { CurrencyUnitEnum } from '../modules/products/enum/ProductEnum';
import {VehicleTypeList} from "../modules/products/constants/InsuranceProductConstants";
import {IProductService} from "../modules/products/service/products/ProductServiceInterface";
import {InsuranceProductCapacityUnitEnum} from "../modules/products/enum/InsuranceProductEnum";
import {
  ISectionPromotionRelationService
} from "../modules/sections/section-promotion-relation/service/SectionPromotionRelationServiceInterface";
@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);
  constructor(
    @Inject(IUserService) private userService: IUserService,
    @Inject(IEmailService) private mailService: IEmailService,
    // @Inject(IFileService) private fileService: IFileService,
    @Inject(IOrderService) private orderService: IOrderService,
    @Inject(IAgentService) private agentService: IAgentService,
    @Inject(IPromotionService) private promotionService: IPromotionService,
    @Inject(ICustomerService) private customerService: ICustomerService,
    @Inject(ISystemConfigurationService)
    private systemConfigurationService: ISystemConfigurationService,
    @Inject(IServiceService) private serviceService: IServiceService,
    @Inject(IProductService) private productService: IProductService,
    @Inject(ISectionPromotionRelationService) private sectionPromotionService: ISectionPromotionRelationService,
  ) {}

  // @Cron('45 * * * * *')
  // handleCron() {
  //   this.logger.debug('Called when the second is 45');
  // }

  // @Interval(10000)
  // handleInterval() {
  //   this.logger.debug('Called every 10 seconds');

  // }

  // @Timeout(5000)
  // handleTimeout() {
  //   this.logger.debug('Called once after 5 seconds');
  // }

  // @Cron(CronExpression.EVERY_DAY_AT_6PM, { timeZone: 'Asia/Ho_Chi_Minh' })
  // async exportData() {
  //   const users =
  //     await this.userService.getUserListByConditionWithoutPagination(
  //       {
  //         created_at: {
  //           [Op.gte]: `2022-05-30T00:00:00.000Z`,
  //         },
  //       },
  //       'public',
  //     );
  //   const agents = users
  //     .filter((user) => user.agent_details !== null)
  //     .map((agent) => agent.transformToResponse());
  //   const fields = exportAgentFields();
  //   const result = agents.map((agent) => ({
  //     agent_name: agent.agent.name,
  //     agent_phone_number: agent.agent.phone_number,
  //     agent_address: agent.agent.address,
  //     agent_avatar: agent.agent.avatar,
  //     // agent_images: JSON.stringify(agent.agent.images),
  //     agent_description: agent.agent.description,
  //     top_agent: agent.agent.top_agent,
  //     created_at: `${format(new Date(agent.agent.created_at), 'yyyy-MM-dd')}`,
  //     company_tax_id: agent.company.tax_id,
  //     company_name: agent.company.name,
  //     company_phone_number: agent.company.phone_number,
  //     company_address: agent.company.address,
  //     company_size: agent.company.size,
  //     // company_license: agent.company.license,
  //     company_email: agent.company.email,
  //     // company_other_info: JSON.stringify(agent.company.other_info),
  //   }));
  //   // export to csv
  //   try {
  //     const csv = parseCsvData(fields, result);
  //     this.mailService.sendTextEmail({
  //       client: EmailClientOptionEnum.MAILGUN,
  //       data: {
  //         from: process.env.MAILGUN_EMAIL_SENDER,
  //         subject: 'Carx Daily Report',
  //         to: process.env.MAILGUN_EMAIL_RECEIVER,
  //         html: `<p>See attachment for your daily report</p>`,
  //         attachment: [
  //           {
  //             filename: `Report-${format(new Date(), 'dd-MM-yyyy')}.csv`,
  //             data: csv,
  //           },
  //         ],
  //       },
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  @Cron(CronExpression.EVERY_HOUR, { timeZone: 'Asia/Ho_Chi_Minh' })
  async updateAgentTotalOrdersAndRevenue() {
    try {
      const agents = await this.agentService.getAgentListWithoutPaging([]);
      for (const agent of agents) {
        const numberOfOrders = await this.orderService.countOrderByCondition({
          agent_id: agent.id,
          status: OrderStatusEnum.COMPLETED,
        });
        const totalOrderValue = await this.orderService.sumOrderByCondition({
          agent_id: agent.id,
          status: OrderStatusEnum.COMPLETED,
        });
        const params = {
          total_orders: numberOfOrders,
          total_revenue: totalOrderValue,
        };
        if (numberOfOrders > 0) {
          await this.agentService.updateAgent(agent.id, params);
        }
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { timeZone: 'Asia/Ho_Chi_Minh' })
  async updatePromotionStatus() {
    try {
      const today = new Date();
      const promotions =
        await this.promotionService.getPromotionListByConditionWithoutPagination(
          {
            status: {
              [Op.not]: PromotionStatusEnum.EXPIRED,
            },
            // end_date: {
            //   [Op.lte]: today,
            // },
          },
        );
      await Promise.all(
        promotions.map(async (promotion) => {
          if (promotion.end_date <= today) {
            promotion.status = PromotionStatusEnum.EXPIRED;
            const sectionPromotion =
              await this.sectionPromotionService.getDetailByCondition({ promotion_id: promotion.id });
            if (sectionPromotion) {
              await this.sectionPromotionService.deleteByCondition({ promotion_id: promotion. id, section_id: sectionPromotion.section_id });
            }
          } else if (promotion.start_date >= today) {
            promotion.status = PromotionStatusEnum.ACTIVATING;
          }
          promotion.save();
        }),
      );

      // UPDATE CUSTOMER AVAILABLE POINTS
      const pointConfiguration =
        await this.systemConfigurationService.getSystemConfigurationDetailByCondition(
          { name: 'Điểm sử dụng trong ngày' },
        );
      const customers =
        await this.customerService.getCustomerListByConditionWithoutPagination(
          {},
        );
      await Promise.all(
        customers.map((customer) => {
          customer.available_points = pointConfiguration.apply_value;
          customer.save();
        }),
      );
    } catch (error) {
      throw error;
    }
  }
  // CREATE MAINTENANCE-AGENT RESCUE SERVICES
  // @Cron(CronExpression.EVERY_30_SECONDS)
  // async createMaintenanceAgentRescueService() {
  //   try {
  //     const maintenanceAgents = await this.agentService.getAgentListWithoutPaging({
  //       category_id: '5530a10b-ffb8-43be-bb90-1d09c293cace'
  //     });
  //     if (maintenanceAgents.length) {
  //       maintenanceAgents.map(async (agent) => {
  //         await this.serviceService.createService({
  //           agent_id: agent.id,
  //           price: 0,
  //           is_rescue_service: true,
  //           is_guaranteed: false,
  //           name: 'Cứu hộ tại garage',
  //           currency_unit: CurrencyUnitEnum.VND,
  //           description: 'Dịch vụ cứu hộ tại garage',
  //           category_ids: ['7f872e92-587a-4f19-9d94-e0e994890b30']
  //         }, agent.user_id);
  //       });
  //     }
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // ACTIVATE CURRENT AGENTS
  // @Cron(CronExpression.EVERY_30_SECONDS)
  // async createMaintenanceAgentRescueService() {
  //   try {
  //     const agents = await this.agentService.getAgentListWithoutPaging({
  //       is_activated: false,
  //     });
  //     agents.forEach(agent => agent.update({ is_activated: true }));
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // ADD INSURANCE PRODUCT TO INSURANCE AGENT
  // @Cron(CronExpression.EVERY_30_SECONDS)
  // async addInsuranceProductToInsuranceAgent() {
  //   try {
  //       const agent = await this.agentService.getAgentDetails('b4677ca9-3b9d-419f-a61d-d7a5d2d95009');
  //       VehicleTypeList.forEach((item) =>
  //           item.usage.forEach((itemUsage) => {
  //               itemUsage.information.forEach((itemUsageInformation) => {
  //                       const payload = {
  //                           name: `Bảo hiểm TNDSBB ${item.name} (xe ${itemUsage.capacity === 100 ? `vừa chở người vừa chở hàng` : `${itemUsage.capacity} ${itemUsage.unit === 'TONS' ? 'tấn' : 'chỗ'}`})`,
  //                           price: itemUsageInformation.non_taxed_price + itemUsageInformation.tax_value + ((itemUsageInformation.non_taxed_price + itemUsageInformation.tax_value) * 20) / 100,
  //                           images: ['https://bamboohealth.s3.ap-southeast-1.amazonaws.com/files/d4428bb5503912f87dd5c128d44ae9ef'],
  //                           discount_price: 0,
  //                           insurance_product_info: {
  //                               capacity: itemUsage.capacity,
  //                               insurance_amount: item.insurance_amount,
  //                               is_business: item.is_business,
  //                               max_insurance_time: itemUsageInformation.insurance_time,
  //                               car_type_code: item.car_type_code,
  //                               capacity_unit: InsuranceProductCapacityUnitEnum[itemUsage.unit],
  //                               required_non_tax_price: itemUsageInformation.non_taxed_price,
  //                               required_taxed_price: itemUsageInformation.non_taxed_price + itemUsageInformation.tax_value,
  //                               tax_percentage: 10,
  //                               usage_code: itemUsage.code,
  //                           },
  //                           description: '',
  //                       }
  //                       console.log(payload);
  //                       this.productService.createInsuranceProduct(payload, agent.user_id);
  //                   }
  //               );
  //               if (itemUsage.combo) {
  //                   const oneYearInsuranceProductInformation =
  //                       itemUsage.information.find(
  //                           (itemUsageInformation) =>
  //                               itemUsageInformation.insurance_time === 2,
  //                       );
  //                   const productPrice =
  //                       oneYearInsuranceProductInformation.non_taxed_price +
  //                       oneYearInsuranceProductInformation.tax_value +
  //                       itemUsage.combo.price +
  //                       ((oneYearInsuranceProductInformation.non_taxed_price +
  //                               oneYearInsuranceProductInformation.tax_value +
  //                               itemUsage.combo.price) *
  //                           20) /
  //                       100;
  //                   this.productService.createInsuranceProduct(
  //                       {
  //                           name: `Bảo hiểm combo ATVC ${item.name} (xe ${itemUsage.capacity === 100 ? `vừa chở người vừa chở hàng` : `${itemUsage.capacity} chỗ`})`,
  //                           price: productPrice,
  //                           images: ['https://bamboohealth.s3.ap-southeast-1.amazonaws.com/files/d4428bb5503912f87dd5c128d44ae9ef'],
  //                           discount_price: 0,
  //                           insurance_product_info: {
  //                               capacity: itemUsage.capacity,
  //                               insurance_amount: item.insurance_amount,
  //                               is_business: item.is_business,
  //                               max_insurance_time:
  //                               oneYearInsuranceProductInformation.insurance_time,
  //                               car_type_code: item.car_type_code,
  //                               capacity_unit: InsuranceProductCapacityUnitEnum[itemUsage.unit],
  //                               required_non_tax_price: oneYearInsuranceProductInformation.non_taxed_price,
  //                               required_taxed_price: oneYearInsuranceProductInformation.non_taxed_price + oneYearInsuranceProductInformation.tax_value,
  //                               tax_percentage: 10,
  //                               usage_code: itemUsage.code,
  //                               is_combo: true,
  //                               is_voluntary: true,
  //                               voluntary_seats: itemUsage.capacity,
  //                               voluntary_amount: itemUsage.combo.amount,
  //                               voluntary_price: itemUsage.combo.price,
  //                               combo_price: 0,
  //                           },
  //                           description: '',
  //                       },
  //                       agent.user_id,
  //                   );
  //               }
  //           }),
  //       );
  //   } catch (error) {
  //     console.log(error.message);
  //     throw error;
  //   }
  // }

  // @Cron(CronExpression.EVERY_30_SECONDS)
  // async updateProductAndServiceAgentCategories() {
  //   try {
  //     const agentList = await this.agentService.getAgentListWithoutPaging({});
  //     agentList.map(async (agent) => {
  //       const agentCategoryId = agent.category_id;
  //       const products = await this.productService.getProductListByConditionWithoutPagination({
  //         agent_id: agent.id,
  //       });
  //       const services = await this.serviceService.getServiceListByConditionWithoutPagination({
  //         agent_id: agent.id,
  //       });
  //
  //       if (products.length) {
  //         const productIds = products.filter(product =>
  //           product.agent_category_id !== '65a347b9-3c84-4e23-9856-c7245d7bdffd' &&
  //           product.agent_category_id !== 'd619d1a1-9313-4e9b-8a50-dd176177f0de' &&
  //           !product.is_insurance_product
  //         ).map(product => product.id);
  //         if (productIds && productIds.length) {
  //           this.productService.updateProductByCondition({ id: productIds }, { agent_category_id: agentCategoryId });
  //         }
  //       }
  //
  //       if (services.length) {
  //         const serviceIds = services.filter(service =>
  //           service.agent_category_id !== '65a347b9-3c84-4e23-9856-c7245d7bdffd' &&
  //           service.agent_category_id !== 'd619d1a1-9313-4e9b-8a50-dd176177f0de' &&
  //           !service.is_rescue_service
  //         ).map(service => service.id);
  //         if (serviceIds && serviceIds.length) {
  //           this.serviceService.updateServiceByCondition({ id: serviceIds }, { agent_category_id: agentCategoryId });
  //         }
  //       }
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     throw error;
  //   }
  // }
}
