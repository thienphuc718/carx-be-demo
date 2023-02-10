import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PostTagModel } from '../../../models/PostTags';
import { PostModel } from '../../../models/Posts';
import { PostTagController } from '../controller/post-tag/PostTagController';
import { PostTagRepositoryImplementation } from '../repository/post-tag/PostTagRepositoryImplementation';
import { IPostTagRepository } from '../repository/post-tag/PostTagRepositoryInterface';
import { PostTagServiceImplementation } from '../service/post-tag/PostTagServiceImplementation';
import { IPostTagService } from '../service/post-tag/PostTagServiceInterface';
import { PostTagSelectedModel } from '../../../models';

@Module({
  imports: [SequelizeModule.forFeature([PostTagModel, PostModel, PostTagSelectedModel])],
  providers: [
    {
      provide: IPostTagRepository,
      useClass: PostTagRepositoryImplementation,
    },
    {
      provide: IPostTagService,
      useClass: PostTagServiceImplementation,
    },
  ],
  exports: [IPostTagService],
  controllers: [PostTagController],
})
export class PostTagModule {}
