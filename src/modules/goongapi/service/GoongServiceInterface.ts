// import {
//   GetCurlPayloadDto,
//   PostCurlPayloadDto,
//   PutCurlPayloadDto,
//   DeleteCurlPayloadDto
// } from '../dto/CurlDto';

export interface IGoongService {
  getGeoLocation(address: string): Promise<any>
}

export const IGoongService = Symbol('IGoongService');
