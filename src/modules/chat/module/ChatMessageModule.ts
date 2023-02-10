import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppGatewayModule } from '../../../gateway/AppGatewayModule';
import { ChatMessageModel } from '../../../models';
import { AgentModule } from '../../agents/module/AgentModule';
import { CustomerModule } from '../../customers/module';
import { NotificationModule } from '../../notifications/module/NotificationModule';
import { ChatMessageController } from '../controller/ChatMessageController';
import { ChatMessageRepositoryImplementation } from '../repository/chat-message/ChatMessageRepositoryImplementation';
import { IChatMessageRepository } from '../repository/chat-message/ChatMessageRepositoryInterface';
import { ChatMessageServiceImplementation } from '../service/chat-message/ChatMessageServiceImplementation';
import { IChatMessageService } from '../service/chat-message/ChatMessageServiceInterface';
import { ChatConversationModule } from './ChatConversationModule';
import { ForbiddenKeywordModule } from '../../forbidden-keywords/module/ForbiddenKeywordModule';

@Module({
  imports: [
    SequelizeModule.forFeature([ChatMessageModel]),
    ChatConversationModule,
    AppGatewayModule,
    NotificationModule,
    AgentModule,
    CustomerModule,
    forwardRef(() => ForbiddenKeywordModule),
  ],
  providers: [
    {
      provide: IChatMessageRepository,
      useClass: ChatMessageRepositoryImplementation,
    },
    {
      provide: IChatMessageService,
      useClass: ChatMessageServiceImplementation,
    },
  ],
  exports: [IChatMessageService],
  controllers: [ChatMessageController],
})
export class ChatMessageModule {}
