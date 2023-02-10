import { Module } from '@nestjs/common';
import { SendGridServiceImplement } from '../service/sendgrid/SendGridServiceImplement';
import { IEmailService } from '../service/EmailServiceInterface';
import { EmailServiceBaseImplement } from '../service/EmailServiceBaseImplement';
import { MailGunServiceImplement } from '../service/mailgun/MailgunServiceImplement';

@Module({
  providers: [
    {
      provide: IEmailService,
      useClass: EmailServiceBaseImplement,
    },
    SendGridServiceImplement,
    MailGunServiceImplement
  ],
  exports: [IEmailService],
})
export class EmailModule {}
