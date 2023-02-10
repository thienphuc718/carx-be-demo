import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AgentCategoryModel } from '../../../models';
import { UserModule } from '../../users/module/UserModule';
import { AgentCategoryController } from '../controller/AgentCategoryController';
import { AgentCategoryRepositoryImplementation } from '../repository/AgentCategoryRepositoryImplementation';
import { IAgentCategoryRepository } from '../repository/AgentCategoryRepositoryInterface';
import { AgentCategoryServiceImplementation } from '../service/AgentCategoryServiceImplementation';
import { IAgentCategoryService } from '../service/AgentCategoryServiceInterface';

@Module({
  imports: [SequelizeModule.forFeature([AgentCategoryModel]), forwardRef(() => UserModule)],
  providers: [
    {
      provide: IAgentCategoryRepository,
      useClass: AgentCategoryRepositoryImplementation,
    },
    {
      provide: IAgentCategoryService,
      useClass: AgentCategoryServiceImplementation,
    },
  ],
  exports: [IAgentCategoryService],
  controllers: [AgentCategoryController],
})
export class AgentCategoryModule {}
