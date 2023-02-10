import { Injectable } from '@nestjs/common';
import { Client } from 'onesignal-node';
import {
  ClientResponse,
  CreateNotificationBody,
} from 'onesignal-node/lib/types';

@Injectable()
export class PushAgentNotificationServiceImplementation {
  private client: Client;
  constructor() {
    this.client = new Client(
      process.env.ONESIGNAL_AGENT_APP_ID,
      process.env.ONESIGNAL_AGENT_API_KEY,
    );
  }

  createPushNotification(
    payload: CreateNotificationBody,
  ): Promise<ClientResponse> {
    return this.client.createNotification(payload);
  }
}
