import { Injectable } from '@nestjs/common';
import { Client } from 'onesignal-node';
import {
  ClientResponse,
  CreateNotificationBody,
} from 'onesignal-node/lib/types';

@Injectable()
export class PushCustomerNotificationServiceImplementation {
  private client: Client;
  constructor() {
    this.client = new Client(
      process.env.ONESIGNAL_USER_APP_ID,
      process.env.ONESIGNAL_USER_API_KEY,
    );
  }

  createPushNotification(
    payload: CreateNotificationBody,
  ): Promise<ClientResponse> {
    return this.client.createNotification(payload);
  }
}
