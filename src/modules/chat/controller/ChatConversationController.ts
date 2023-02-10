import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseController } from '../../../BaseController';
import { AuthGuard } from '../../../guards';
import { IChatConversationService } from '../service/chat-conversation/ChatConversationServiceInterface';
import * as express from 'express';
import {
  CreateChatConversationDto,
  FilterChatConversationDto,
} from '../dto/ChatConversationDto';
import { Result } from '../../../results/Result';

@Controller('/v1/chat-conversations')
@ApiTags('Chat Conversations')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class ChatConversationController extends BaseController {
  constructor(
    @Inject(IChatConversationService)
    private chatConversationService: IChatConversationService,
  ) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get All Chat Conversations' })
  async getAllChatConversations(
    @Res() response: express.Response,
    @Query() queryParams: FilterChatConversationDto,
  ) {
    try {
      const conversations =
        await this.chatConversationService.getAllChatConversationList(
          queryParams,
        );
      const total =
        await this.chatConversationService.countChatConversationByCondition(
          queryParams,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: {
          conversation_list: conversations.map((conversation) => conversation.transformToResponse()),
          total: total,
        },
      });
      return this.ok(response, result.value);
    } catch (error) {
      const err = Result.fail({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
      return this.fail(response, err.error);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Conversation Detail' })
  async getConversationDetail(
    @Res() response: express.Response,
    @Param('id') conversationId: string,
  ) {
    try {
      const conversation =
        await this.chatConversationService.getChatConversationDetail(
          conversationId,
        );
      let result = null;
      if (!conversation) {
        result = Result.fail({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Conversation details not found',
        });
      } else {
        result = Result.ok({
          statusCode: HttpStatus.OK,
          data: conversation.transformToResponse(),
        });
      }
      return this.ok(response, result.value);
    } catch (error) {
      const err = Result.fail({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
      return this.fail(response, err.error);
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create Conversation' })
  async createNewBooking(
    @Res() response: express.Response,
    @Body() createConversationDto: CreateChatConversationDto,
  ) {
    try {
      const createdConversation =
        await this.chatConversationService.createChatConversation(
          createConversationDto,
        );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: createdConversation,
      });
      return this.ok(response, result.value);
    } catch (error) {
      const err = Result.fail({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
      return this.fail(response, err.error);
    }
  }
}
