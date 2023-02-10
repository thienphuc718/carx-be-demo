import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CommentModel } from '../../../models';
import { ActivityModule } from '../../activities/module/ActivityModule';
import { ForbiddenKeywordModule } from '../../forbidden-keywords/module/ForbiddenKeywordModule';
import { NotificationModule } from '../../notifications/module/NotificationModule';
import { PostModule } from '../../posts/module/PostModule';
import { UserModule } from '../../users/module/UserModule';
import { CommentController } from '../controller/CommentController';
import { CommentRepositoryImplementation } from '../repository/CommentRepositoryImplement';
import { ICommentRepository } from '../repository/CommentRepositoryInterface';
import { CommentServiceImplementation } from '../service/CommentServiceImplement';
import { ICommentService } from '../service/CommentServiceInterface';

@Module({
  imports: [
    SequelizeModule.forFeature([CommentModel]),
    ActivityModule,
    PostModule,
    UserModule,
    NotificationModule,
    ForbiddenKeywordModule,
  ],
  providers: [
    {
      provide: ICommentRepository,
      useClass: CommentRepositoryImplementation,
    },
    {
      provide: ICommentService,
      useClass: CommentServiceImplementation,
    },
  ],
  controllers: [CommentController],
  exports: [ICommentService],
})
export class CommentModule {}
