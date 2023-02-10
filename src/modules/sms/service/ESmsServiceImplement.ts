import { Inject, Injectable } from '@nestjs/common';

import {
  FilterESmsDto,
  CreateESmsDto,
  UpdateESmsDto,
} from '../dto/ESmsDto';
import { ICurlService } from '../../curl/service/CurlServiceInterface';
import { ISmsService } from './SmsServiceInterface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ESmsServiceImplementation implements ISmsService {
  private endPoint;

  constructor(
    @Inject(ICurlService)
    private curlService: ICurlService
  ) {
    this.endPoint = "http://rest.esms.vn/MainService.svc/json/SendMultipleMessage_V4_get";
  }

  async send(phoneNumber: string, message: string): Promise<boolean> {
    let setting = {
      api_key: process.env.ESMS_API_KEY,
      secret: process.env.ESMS_SECRET,
      brand: false
    }

    let url = this.endPoint + "?Phone=" + phoneNumber + "&ApiKey=" + setting.api_key + "&SecretKey=" + setting.secret + "&Content=" + message
    if (setting.brand) {
      url += "&Brandname=" + setting.brand + "&ESmsType=2"
    } else {
      url += "&ESmsType=8"
    }
    try {
      const data = await this.curlService.sendGetRequest({ url })
      return true;
    } catch (err) {
      return false;
    }
  }
}
