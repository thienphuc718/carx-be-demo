import { Module } from '@nestjs/common';
import { StaffReportController } from '../controller/StaffReportController';
import { AgentModule } from '../../agents/module/AgentModule';
import { OrderModule } from '../../orders/module/OrderModule';
import { UserModule } from '../../users/module/UserModule';
import { FileModule } from '../../files/module/FileModule';
import { SystemConfigurationModule } from '../../system-configurations/module/SystemConfigurationModule';
import { IStaffReportService } from '../service/StaffReportServiceInterface';
import { StaffReportServiceImplementation } from '../service/StaffReportServiceImplementation';
import { ProductModule } from '../../products/module';
import {CustomerModule} from "../../customers/module";
import {StaffModule} from "../../staffs/module/StaffModule";

@Module({
  imports: [
    AgentModule,
    OrderModule,
    UserModule,
    ProductModule,
    FileModule,
    SystemConfigurationModule,
    CustomerModule,
    StaffModule,
  ],
  providers: [
    {
      provide: IStaffReportService,
      useClass: StaffReportServiceImplementation,
    },
  ],
  controllers: [StaffReportController],
})
export class StaffReportModule {}
