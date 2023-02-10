import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ReviewModel } from '../../../models';
import { AgentModule } from '../../agents/module/AgentModule';
import { CustomerModule } from '../../customers/module';
import { NotificationModule } from '../../notifications/module/NotificationModule';
import { OrderModule } from '../../orders/module/OrderModule';
import { PushNotificationModule } from '../../push-notifications/module/PushNotificationModule';
import { ReviewController } from '../controller/ReviewController';
import { ReviewRepositoryImplementation } from '../repository/ReviewRepositoryImplementation';
import { IReviewRepository } from '../repository/ReviewRepositoryInterface';
import { ReviewServiceImplementation } from '../service/ReviewServiceImplementation';
import { IReviewService } from '../service/ReviewServiceInteface';
import { ForbiddenKeywordModule } from '../../forbidden-keywords/module/ForbiddenKeywordModule';

@Module({
  imports: [
    SequelizeModule.forFeature([ReviewModel]),
    AgentModule,
    OrderModule,
    NotificationModule,
    PushNotificationModule,
    CustomerModule,
    forwardRef(() => ForbiddenKeywordModule),
  ],
  providers: [
    {
      provide: IReviewRepository,
      useClass: ReviewRepositoryImplementation,
    },
    {
      provide: IReviewService,
      useClass: ReviewServiceImplementation,
    },
  ],
  controllers: [ReviewController],
  exports: [],
})
export class ReviewModule {}
