import { Inject } from '@nestjs/common';
import { ICurlService } from '../../curl/service/CurlServiceInterface';
import { IGoongService } from './GoongServiceInterface';
import { normalizeString } from '../../../helpers/stringHelper';


export class GoongServiceImplement implements IGoongService {
  constructor(
      @Inject(ICurlService) private curlService: ICurlService
    ) {
  }

  getGeoLocation(address: string): Promise<any> {
    const url = `https://rsapi.goong.io/geocode?address=${normalizeString(address)}&api_key=DxdWggKYaz4xAFzKOx2ezYzej1gUsnp7LEK94mJx`;
    return this.curlService.sendGetRequest({url});
  }
}
