import * as sgMail from "@sendgrid/mail"
export type SendGridMailData = sgMail.MailDataRequired;

export type EmailAttachmentPayload = {
  file: any;
  name: string;
  type: string;
};

export type MailgunMailData = {
  to: string;
  from: string;
  subject: string;
  cc?: string;
  bcc?: string;
  template?: string;
  html?: string;
  text?: string;
  attachment?: any;
};
