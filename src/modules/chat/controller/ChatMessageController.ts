import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseController } from '../../../BaseController';
import { IChatMessageService } from '../service/chat-message/ChatMessageServiceInterface';
import * as express from 'express';
import { Result } from '../../../results/Result';
import {
  CreateChatMessageDto,
  FilterChatMessageDto,
} from '../dto/ChatMessagesDto';
import { AuthGuard } from '../../../guards';

@Controller('/v1/chat-messages')
@ApiTags('Chat Messages')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class ChatMessageController extends BaseController {
  constructor(
    @Inject(IChatMessageService)
    private chatMessageService: IChatMessageService,
  ) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get All Chat Conversations' })
  async getAllChatMessages(
    @Res() response: express.Response,
    @Query() queryParams: FilterChatMessageDto,
  ) {
    try {
      const messages = await this.chatMessageService.getAllChatMessages(
        queryParams,
      );
      const total = await this.chatMessageService.countChatMessagesByCondition(
        queryParams,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: {
          message_list: messages,
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

  @Post()
  @ApiOperation({ summary: 'Create Message' })
  async createNewBooking(
    @Res() response: express.Response,
    @Body() createConversationDto: CreateChatMessageDto,
  ) {
    try {
      const createdMessage = await this.chatMessageService.createChatMessage(
        createConversationDto,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: createdMessage,
      });
      return this.ok(response, result.value);
    } catch (error) {
      const err = Result.fail({
        statusCode: error.code ? HttpStatus.BAD_REQUEST : HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
        errorCode: error.code,
        data: error.value
      });
      return this.fail(response, err.error);
    }
  }
}
