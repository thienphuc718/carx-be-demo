import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RecommendedKeywordModel } from '../../../models';
import { RecommendedKeywordController } from '../controller/ReommendedKeywordController';
import { RecommendedKeywordRepositoryImplementation } from '../repository/RecommendedKeywordRepositoryImplementation';
import { IRecommendedKeywordRepository } from '../repository/RecommendedKeywordRepositoryInterface';
import { RecommendedKeywordServiceImplementation } from '../service/RecommendedKeywordServiceImplementation';
import { IRecommendedKeywordService } from '../service/RecommendedKeywordServiceInterface';

@Module({
  imports: [SequelizeModule.forFeature([RecommendedKeywordModel])],
  providers: [
    {
      provide: IRecommendedKeywordRepository,
      useClass: RecommendedKeywordRepositoryImplementation,
    },
    {
      provide: IRecommendedKeywordService,
      useClass: RecommendedKeywordServiceImplementation,
    },
  ],
  controllers: [RecommendedKeywordController],
  exports: [IRecommendedKeywordService],
})
export class RecommendedKeywordModule {}
