import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RoleFeatureRelationModel, RoleModel, UserModel } from '../../../models';
import { UserModule } from '../../users/module/UserModule';
import { RoleController } from '../controller/RoleController';
import { RoleRepositoryImplementation } from '../repository/RoleRepositoryImplement';
import { IRoleRepository } from '../repository/RoleRepositoryInterface';
import { RoleServiceImplementation } from '../service/RoleServiceImplement';
import { IRoleService } from '../service/RoleServiceInterface';

@Module({
  imports: [
    SequelizeModule.forFeature([RoleModel, RoleFeatureRelationModel, UserModel]),
    forwardRef(() => UserModule),
  ],
  providers: [
    {
      provide: IRoleRepository,
      useClass: RoleRepositoryImplementation,
    },
    {
      provide: IRoleService,
      useClass: RoleServiceImplementation,
    },
  ],
  exports: [IRoleService],
  controllers: [RoleController],
})
export class RoleModule {}
