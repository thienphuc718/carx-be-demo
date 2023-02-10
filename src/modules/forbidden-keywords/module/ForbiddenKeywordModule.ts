import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ForbiddenKeywordModel } from '../../../models';
import { ForbiddenKeywordController } from '../controller/ForbiddenKeywordController';
import { ForbiddenKeywordRepositoryImplementation } from '../repository/ForbiddenKeywordRepositoryImplementation';
import { IForbiddenKeywordRepository } from '../repository/ForbiddenKeywordRepositoryInterface';
import { ForbiddenKeywordServiceImplementation } from '../service/ForbiddenKeywordServiceImplementation';
import { IForbiddenKeywordService } from '../service/ForbiddenKeywordServiceInterface';
import { StaffModule } from '../../staffs/module/StaffModule';

@Module({
  imports: [
    SequelizeModule.forFeature([ForbiddenKeywordModel]),
    forwardRef(() => StaffModule),
  ],
  providers: [
    {
      provide: IForbiddenKeywordRepository,
      useClass: ForbiddenKeywordRepositoryImplementation,
    },
    {
      provide: IForbiddenKeywordService,
      useClass: ForbiddenKeywordServiceImplementation,
    },
  ],
  controllers: [ForbiddenKeywordController],
  exports: [IForbiddenKeywordService],
})
export class ForbiddenKeywordModule {}
