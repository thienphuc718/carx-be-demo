import { forwardRef, Module } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { AgentModule } from '../modules/agents/module/AgentModule';
import { CompanyModule } from '../modules/companies/module/CompanyModule';
import { CustomerModule } from '../modules/customers/module';
import { EmailModule } from '../modules/email/module/EmailModule';
import { FileModule } from '../modules/files/module/FileModule';
import { OrderItemModule } from '../modules/orders/module/OrderItemModule';
import { OrderModule } from '../modules/orders/module/OrderModule';
import { ProductModule } from '../modules/products/module';
import { PromotionModule } from '../modules/promotions/module/PromotionModule';
import { ServiceModule } from '../modules/services/module/ServiceModule';
import { SystemConfigurationModule } from '../modules/system-configurations/module/SystemConfigurationModule';
import { UserModule } from '../modules/users/module/UserModule';
import { TaskService } from './TaskService';
import {
  SectionPromotionRelationModule
} from "../modules/sections/section-promotion-relation/module/SectionPromotionRelationModule";

@Module({
  imports: [UserModule, AgentModule, CompanyModule, FileModule, EmailModule, PromotionModule, OrderModule, CustomerModule, SystemConfigurationModule, ServiceModule, ProductModule, SectionPromotionRelationModule],
  providers: [TaskService, SchedulerRegistry],
})
export class TaskModule { }
