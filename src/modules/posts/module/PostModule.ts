import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PostCategoryModel } from '../../../models/PostCategories';
import { PostCategorySelectedModel } from '../../../models/PostCategorySelected';
import { PostModel } from '../../../models/Posts';
import { PostTagModel } from '../../../models/PostTags';
import { PostTagSelectedModel } from '../../../models/PostTagSelected';
import { ActivityModule } from '../../activities/module/ActivityModule';
import { UserModule } from '../../users/module/UserModule';
import { PostController } from '../controller/post/PostsController';
import { PostRepositoryImplementation } from '../repository/post/PostRepositoryImplementation';
import { IPostRepository } from '../repository/post/PostRepositoryInterface';
import { PostServiceImplementation } from '../service/post/PostServiceImplementation';
import { IPostService } from '../service/post/PostServiceInterface';
import { ForbiddenKeywordModule } from '../../forbidden-keywords/module/ForbiddenKeywordModule';
import {SectionPostRelationModule} from "../../sections/section-post-relation/module/SectionPostRelationModule";

@Module({
  imports: [
    SequelizeModule.forFeature([
      PostModel,
      PostTagModel,
      PostCategoryModel,
      PostTagSelectedModel,
      PostCategorySelectedModel,
    ]),
    ForbiddenKeywordModule,
    forwardRef(() => UserModule),
    ActivityModule,
    forwardRef(() => SectionPostRelationModule)
  ],
  providers: [
    {
      provide: IPostRepository,
      useClass: PostRepositoryImplementation,
    },
    {
      provide: IPostService,
      useClass: PostServiceImplementation,
    },
  ],
  exports: [IPostService],
  controllers: [PostController],
})
export class PostModule {}
