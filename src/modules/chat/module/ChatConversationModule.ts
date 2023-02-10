import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ChatConversationModel } from '../../../models';
import { AgentModule } from '../../agents/module/AgentModule';
import { CustomerModule } from '../../customers/module';
import { ChatConversationController } from '../controller/ChatConversationController';
import { ChatConversationRepositoryImplementation } from '../repository/chat-conversation/ChatConversationRepositoryImplementation';
import { IChatConversationRepository } from '../repository/chat-conversation/ChatConversationRepositoryInterface';
import { ChatConversationServiceImplementation } from '../service/chat-conversation/ChatConversationServiceImplementation';
import { IChatConversationService } from '../service/chat-conversation/ChatConversationServiceInterface';

@Module({
  imports: [
    SequelizeModule.forFeature([ChatConversationModel]),
    AgentModule,
    CustomerModule,
  ],
  providers: [
    {
      provide: IChatConversationService,
      useClass: ChatConversationServiceImplementation,
    },
    {
      provide: IChatConversationRepository,
      useClass: ChatConversationRepositoryImplementation,
    },
  ],
  exports: [IChatConversationService],
  controllers: [ChatConversationController],
})
export class ChatConversationModule {}
