import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import { EmailAttachmentPayload, SendGridMailData } from '../../type/EmailType';

@Injectable()
export class SendGridServiceImplement {
  private sgMailService: sgMail.MailService;
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    this.sgMailService = sgMail;
  }

  // TODO: implement send text email for sendgrid
  // currently not implemented
  sendTextEmail(payload: SendGridMailData): void {
    try {
      this.sgMailService
        .send(payload)
        .then((res) => console.log('Email has been sent to', payload.to));
    } catch (error) {
      throw error;
    }
  }

  async sendEmailWithAttachment(
    file: EmailAttachmentPayload,
    payload: sgMail.MailDataRequired,
  ): Promise<void> {
    const params: sgMail.MailDataRequired = {
      ...payload,
      attachments: [
        {
          content: file.file,
          filename: file.name,
          type: file.type,
          disposition: 'attachment',
        },
      ],
    };

    try {
      await this.sgMailService.send(params);
      return console.log('Email has been sent to ', payload.to);
    } catch (error) {
      throw error;
    }
  }
}
