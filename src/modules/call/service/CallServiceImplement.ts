import { Inject } from '@nestjs/common';
import { ICurlService } from '../../curl/service/CurlServiceInterface';
import { ICallService } from './CallServiceInterface';
import { generateStringeeToken } from '../../../helpers/jwtHelper';

export class CallServiceImplement implements ICallService {
  private stringeeToken: string;
  constructor(
      @Inject(ICurlService) private curlService: ICurlService
    ) {
    this.stringeeToken = generateStringeeToken();
  }

  private async delay(ms = 3000) {
    return new Promise((r) => setTimeout(r, ms));
  }

  async call(phoneNumber: string, message: string): Promise<boolean> {
    if (phoneNumber.startsWith('0')) {
      phoneNumber = phoneNumber.replace('0', '84');
    }
    const url = `${process.env.STRINGEE_BASE_URL}/v1/call2/callout?&access_token=${this.stringeeToken}`;
    const callOutNumber = process.env.STRINGEE_CALLOUT_NUMBER;

    const callObject = {
      from: {
        type: 'internal',
        number: callOutNumber,
        alias: callOutNumber,
      },
      to: [
        {
          type: 'external',
          number: phoneNumber,
          alias: phoneNumber,
        },
      ],
      actions: [
        {
          action: 'talk',
          text: message,
          voice: 'banmai',
          speed: -3,
        },
      ],
    };

    let result = null;
    try {
      let retryCount = 10; // retry 10 times to send call-rating
      do {
        const { data } = await this.curlService.sendPostRequest({
          url: url,
          token: this.stringeeToken,
          data: callObject,
        });
        result = data;
        if (data.r === 0) {
          retryCount = 0;
        } else {
          await this.delay();
          retryCount--;
        }
      } while (retryCount > 0);
    } catch (err) {
      console.log(err);
      result = err.message;
    }

    return !!result;
  }
}
