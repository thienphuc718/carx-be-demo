import { Inject, Injectable } from '@nestjs/common';
import * as twilio from 'twilio';
import { VietnamCarriersEnum } from '../enum/OtpEnum';
import { IOtpService } from './OtpServiceInterface';
import { ICurlService } from "../../curl/service/CurlServiceInterface";
import { getTemplateString } from "../../../helpers/stringHelper";
import { SmsCallbackQueryDto } from "../dto/OtpDto";

@Injectable()
export class OtpServiceImplement implements IOtpService {
  // client: twilio.Twilio;

  constructor(
    @Inject(ICurlService) private curlService: ICurlService,
  ) {
    // this.client = twilio(
    //   process.env.TWILIO_ACCOUNT_SID,
    //   process.env.TWILIO_AUTH_TOKEN,
    // );
  }

  // async verifyOtp(to: string, code: string): Promise<boolean> {
  //   const result = await this.client.verify.v2
  //     .services(process.env.TWILIO_SERVICE_SID)
  //     .verificationChecks.create({to, code});
  //   if (result.status === 'approved') {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }
  //
  // private phoneNumberLookup(phoneNumber: string) {
  //   return this.client.lookups
  //     .phoneNumbers(phoneNumber)
  //     .fetch({type: ['carrier']});
  // }
  //
  async sendOtpViaEmail(email: string): Promise<boolean> {
    // const result = await this.client.verify.v2
    //   .services(process.env.TWILIO_SERVICE_SID)
    //   .verifications.create({
    //     channel: 'email',
    //     to: email.toLowerCase(),
    //   });
    // if (result) {
    //   return true;
    // }
    // return false;
    throw new Error('Method not implemented')
  }

  async sendOtpViaPhoneNumber(
    phoneNumber: string,
    otp: string,
  ): Promise<boolean> {
    try {
      const countryCode = '84';
      let processedPhoneNumber = phoneNumber;
      if (phoneNumber.startsWith('0')) {
        processedPhoneNumber = countryCode + phoneNumber.slice(1);
      } else {
        processedPhoneNumber = countryCode + phoneNumber
      }
      const message = getTemplateString(phoneNumber, otp);
      // const { data } = await this.curlService.sendPostRequestWithCustomHeader({
      //   url: `${process.env.STEL_API_URL}`,
      //   data: {
      //     from: 'CarX',
      //     to: processedPhoneNumber,
      //     text: message,
      //   },
      //   header: {
      //     Authorization: `Basic ${process.env.STEL_API_KEY}`
      //   }
      // });
      // console.log(data);
      return true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async processSmsCallback(payload: SmsCallbackQueryDto) {
    try {
      console.log(payload);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}