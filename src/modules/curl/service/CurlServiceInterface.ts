import {
    GetCurlPayloadDto,
    PostCurlPayloadDto,
    PutCurlPayloadDto,
    DeleteCurlPayloadDto, CustomerHeaderPostCurlPayloadDto
} from '../dto/CurlDto';

export interface ICurlService {
    sendGetRequest(payload: GetCurlPayloadDto)
    sendPostRequest(payload: PostCurlPayloadDto)
    sendPutRequest(payload: PutCurlPayloadDto)
    sendDeleteRequest(payload: DeleteCurlPayloadDto)
    sendPostRequestWithCustomHeader(payload: CustomerHeaderPostCurlPayloadDto)
}

export const ICurlService = Symbol('ICurlService');
