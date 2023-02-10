import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  ConnectedSocket
} from '@nestjs/websockets';
import { OnEvent } from '@nestjs/event-emitter';
import { Server, Socket } from 'socket.io';
import { SocketService } from "../modules/socket/service/SocketService";
// var md5 = require('md5');

@WebSocketGateway({ cors: true })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() public server: Server;
  constructor(private socketService: SocketService) {}

  afterInit(server: any): any {
    this.socketService.socket = server;
    console.log("init complete");
  }

  async handleConnection(client: Socket) {
    console.log("connected");
  }

  async handleDisconnect(client: Socket) {
    console.log("disconnect");
  }

  @SubscribeMessage('CARX_BOOKING')
  handleEvent(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket
  ) {
    let { action, booking_id, agent_id, customer_id } = data;
    let pushData = {
      action,
      booking_id,
      channel: 'CARX_BOOKING'
    }
    if (action === 'BOOK_SERVICE' || action === 'COMPLETE_PAYMENT_SERVICE' || action === 'CANCEL_SERVICE') {
      client.broadcast.emit(`ROOM_${agent_id}`, pushData);
    } else if (action === 'CONFIRM_SERVICE' || action === 'COMPLETE_SERVICE') {
      client.broadcast.emit(`ROOM_${customer_id}`, pushData);
    }
  }

  @SubscribeMessage('CARX_RESCUES')
  handleRescueEvent(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket
  ) {
    let { rescue_request_id, customer_id, long, lat, agent_id } = data;
    let pushData = {
      rescue_request_id,
      customer_id,
      long,
      lat,
      agent_id,
      channel: 'CARX_RESCUES'
    }
    client.broadcast.emit(`ROOM_${customer_id}`, pushData);
  }
}
