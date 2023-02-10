import { ISmsService } from './SmsServiceInterface';
import * as twilio from 'twilio';

export class TwilioServiceImplement implements ISmsService {
  private client: twilio.Twilio;
  constructor() {
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
  }

  async send(phoneNumber: string, message: string): Promise<boolean> {
    try {
      const result = await this.client.messages.create({
        body: message,
        from: `${process.env.TWILIO_PHONE_NUMBER}`,
        to: phoneNumber,
      });
      return !!result;
    } catch (error) {
      throw error;
    }
  }
}
