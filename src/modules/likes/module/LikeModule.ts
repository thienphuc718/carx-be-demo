import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LikeModel } from '../../../models';
import { ActivityModule } from '../../activities/module/ActivityModule';
import { NotificationModule } from '../../notifications/module/NotificationModule';
import { PostModule } from '../../posts/module/PostModule';
import { UserModule } from '../../users/module/UserModule';
import { LikeController } from '../controller/LikeController';
import { LikeRepositoryImplementation } from '../repository/LikeRepositoryImplementation';
import { ILikeRepository } from '../repository/LikeRepositoryInterface';
import { LikeServiceImplementation } from '../service/LikeServiceImplementation';
import { ILikeService } from '../service/LikeServiceInterface';

@Module({
  imports: [
    SequelizeModule.forFeature([LikeModel]),
    UserModule,
    PostModule,
    ActivityModule,
    NotificationModule,
  ],
  providers: [
    {
      provide: ILikeRepository,
      useClass: LikeRepositoryImplementation,
    },
    {
      provide: ILikeService,
      useClass: LikeServiceImplementation,
    },
  ],
  controllers: [LikeController],
  exports: [ILikeService],
})
export class LikeModule {}
