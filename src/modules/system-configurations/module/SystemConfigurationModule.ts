import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SystemConfigurationModel } from '../../../models';
import { UserModule } from '../../users/module/UserModule';
import { SystemConfigurationController } from '../controller/SystemConfigurationController';
import { SystemConfigurationRepositoryImplementation } from '../repository/SystemConfigurationRepositoryImplementation';
import { ISystemConfigurationRepository } from '../repository/SystemConfigurationRepositoryInterface';
import { SystemConfigurationServiceImplementation } from '../service/SystemConfigurationServiceImplementation';
import { ISystemConfigurationService } from '../service/SystemConfigurationServiceInterface';

@Module({
  imports: [
    SequelizeModule.forFeature([SystemConfigurationModel]),
    forwardRef(() => UserModule),
  ],
  providers: [
    {
      provide: ISystemConfigurationRepository,
      useClass: SystemConfigurationRepositoryImplementation,
    },
    {
      provide: ISystemConfigurationService,
      useClass: SystemConfigurationServiceImplementation,
    },
  ],
  exports: [ISystemConfigurationService],
  controllers: [SystemConfigurationController],
})
export class SystemConfigurationModule {}
