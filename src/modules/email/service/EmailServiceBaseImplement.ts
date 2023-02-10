import { Injectable } from '@nestjs/common';
import { EmailPayloadDto } from '../dto/EmailDto';
import { EmailClientOptionEnum } from '../enum/EmailEnum';
import { EmailAttachmentPayload, MailgunMailData, SendGridMailData } from '../type/EmailType';
import { IEmailService } from './EmailServiceInterface';
import { MailGunServiceImplement } from './mailgun/MailgunServiceImplement';
import { SendGridServiceImplement } from './sendgrid/SendGridServiceImplement';

@Injectable()
export class EmailServiceBaseImplement implements IEmailService {
  constructor(
    private sendgridService: SendGridServiceImplement,
    private mailgunService: MailGunServiceImplement,
  ) {}

  private isMailgunClient(client: string) {
    return client === EmailClientOptionEnum.MAILGUN;
  }

  private isSendGridClient(client: string) {
    return client === EmailClientOptionEnum.SENDGRID;
  }

  sendEmailWithAttachment(
    file: EmailAttachmentPayload,
    payload: EmailPayloadDto,
  ): void {
    const { client, data } = payload;
    if (this.isMailgunClient(client)) {
      this.mailgunService.sendEmailWithAttachment(file, data as MailgunMailData);
    } else if (this.isSendGridClient(client)) {
      this.sendgridService.sendEmailWithAttachment(file, data as SendGridMailData);
    } else {
      throw new Error('Method not supported !');
    }
  }

  sendTextEmail(payload: EmailPayloadDto): void {
    const { client, data } = payload;
    if (this.isMailgunClient(client)) {
      this.mailgunService.sendTextEmail(data as MailgunMailData);
    } else if (this.isSendGridClient(client)) {
      this.sendgridService.sendTextEmail(data as SendGridMailData);
    } else {
      throw new Error('Method not supported !');
    }
  }
}
