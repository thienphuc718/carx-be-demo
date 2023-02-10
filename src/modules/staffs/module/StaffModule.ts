import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StaffModel } from '../../../models';
import { StaffController } from '../controller/StaffController';
import { StaffRepositoryImplementation } from '../repository/StaffRepositoryImplementation';
import { IStaffRepository } from '../repository/StaffRepositoryInterface';
import { StaffServiceImplementation } from '../service/StaffServiceImplementation';
import { IStaffService } from '../service/StaffServiceInterface';
import { UserModule } from '../../users/module/UserModule';
import { AuthModule } from '../../auth/module/AuthModule';
import { RoleModule } from '../../roles/module/RoleModule';

@Module({
  imports: [SequelizeModule.forFeature([
    StaffModel,
  ]),
    forwardRef(() => UserModule),
    AuthModule,
    RoleModule,
  ],
  providers: [
    {
      provide: IStaffRepository,
      useClass: StaffRepositoryImplementation,
    },
    {
      provide: IStaffService,
      useClass: StaffServiceImplementation,
    },
  ],
  controllers: [StaffController],
  exports: [IStaffRepository, IStaffService],
})
export class StaffModule {}
