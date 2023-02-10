import { EmailPayloadDto } from "../dto/EmailDto";
import { EmailAttachmentPayload } from "../type/EmailType";

export interface IEmailService {
    sendEmailWithAttachment(file: EmailAttachmentPayload, payload: EmailPayloadDto): void
    sendTextEmail(payload: EmailPayloadDto): void
}

export const IEmailService = Symbol('IEmailService');
