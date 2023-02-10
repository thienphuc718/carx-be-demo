import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PostCategorySelectedModel } from '../../../models';
import { PostCategoryModel } from '../../../models/PostCategories';
import { PostModel } from '../../../models/Posts';
import { PostCategoryController } from '../controller/post-category/PostCategoryController';
import { PostCategoryRepositoryImplementation } from '../repository/post-category/PostCategoryRepositoryImplementation';
import { IPostCategoryRepository } from '../repository/post-category/PostCategoryRepositoryInterface';
import { PostCategoryServiceImplementation } from '../service/post-category/PostCategoryServiceImplementation';
import { IPostCategoryService } from '../service/post-category/PostCategoryServiceInterface';

@Module({
  imports: [SequelizeModule.forFeature([PostCategoryModel, PostModel, PostCategorySelectedModel])],
  providers: [
    {
      provide: IPostCategoryRepository,
      useClass: PostCategoryRepositoryImplementation,
    },
    {
      provide: IPostCategoryService,
      useClass: PostCategoryServiceImplementation,
    },
  ],
  exports: [IPostCategoryService],
  controllers: [PostCategoryController],
})
export class PostCategoryModule {}
