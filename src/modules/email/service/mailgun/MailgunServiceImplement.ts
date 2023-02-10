import { EmailAttachmentPayload, MailgunMailData } from '../../type/EmailType';
import Mailgun from 'mailgun.js';
import * as formData from 'form-data';
import { MailgunMessageData } from 'mailgun.js/interfaces/Messages';
export class MailGunServiceImplement {
  private mailgun: Mailgun;
  constructor() {
    this.mailgun = new Mailgun(formData);
  }

  private async send(payload: MailgunMailData) {
    const mg = this.mailgun.client({
      username: 'api',
      key: process.env.MAILGUN_API_KEY,
    });

    await mg.messages
      .create(process.env.MAILGUN_DOMAIN, payload)
      .catch((error) => console.log(error));
  }

  //TODO: implement send email with attachment mailgun
  // currently not implemented
  sendEmailWithAttachment(
    file: EmailAttachmentPayload,
    payload: any,
  ): Promise<void> {
    throw new Error('Method sendEmailWithAttachment not implemented.');
  }

  sendTextEmail(payload: MailgunMailData): void {
    this.send(payload).then((res) => console.log(res));
    console.log('Email sent to ' + payload.to);
  }
}
