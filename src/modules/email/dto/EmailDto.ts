import { IsEnum, IsNotEmpty } from "class-validator";
import { EmailClientOptionEnum } from "../enum/EmailEnum";
import * as sgMail from "@sendgrid/mail";
import { MailgunMailData, SendGridMailData } from "../type/EmailType";

export class EmailPayloadDto {
  @IsEnum(EmailClientOptionEnum)
  @IsNotEmpty()
  client: string;

  data: MailgunMailData | SendGridMailData;
}