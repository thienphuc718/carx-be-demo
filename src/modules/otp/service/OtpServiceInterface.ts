import { SmsCallbackQueryDto } from "../dto/OtpDto";

export interface IOtpService {
    sendOtpViaPhoneNumber(phoneNumber: string, otp: string): Promise<boolean>;
    sendOtpViaEmail(email: string): Promise<boolean>;
    processSmsCallback(payload: SmsCallbackQueryDto)
}

export const IOtpService = Symbol('IOtpService');