import { ICurlService } from './CurlServiceInterface';
import Axios from 'axios';
import {
  GetCurlPayloadDto,
  PostCurlPayloadDto,
  PutCurlPayloadDto,
  DeleteCurlPayloadDto, CustomerHeaderPostCurlPayloadDto
} from '../dto/CurlDto';

export class CurlServiceImplementation implements ICurlService {
  public config

  constructor(url) {
    this.config = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8'
      }
    }
  }

  sendGetRequest(payload: GetCurlPayloadDto) {
    if (payload.token) {
      this.config = {
        headers: { Authorization: `${payload.token}` }
      };
    }
    // append header
    this.config = {
      headers: Object.assign(this.config.headers || {}, payload.addheaders)
    }
    return Axios(payload.url, this.config);
  }

  sendPostRequest(payload: PostCurlPayloadDto) {
    try {
      if (payload.token) {
        this.config = {
          headers: { Authorization: `${payload.token}` }
        };
      }
      return Axios.post(payload.url, payload.data, this.config)
    } catch (error) {
      const err = {
        url: payload.url,
        data: payload.data,
        statusCode: error.code,
        message: error.response.message,
      }
      console.log(err);
      throw err;
    }
  }

  sendPutRequest(payload: PutCurlPayloadDto) {
    if (payload.token) {
      this.config = {
        headers: { Authorization: `${payload.token}` }
      };
    }
    return Axios.put(payload.url, payload.data, this.config);
  }

  sendDeleteRequest(payload: DeleteCurlPayloadDto) {
    if (payload.token) {
      this.config = {
        headers: { Authorization: `${payload.token}` }
      };
    }
    return Axios.delete(payload.url, { data: payload.data, ...this.config })
  }

  sendPostRequestWithCustomHeader(payload: CustomerHeaderPostCurlPayloadDto) {
    if (payload.header) {
      this.config = {
        headers: {
          ...this.config.headers,
          ...payload.header,
        }
      }
    }
    return Axios.post(payload.url, payload.data, this.config);
  }
}
