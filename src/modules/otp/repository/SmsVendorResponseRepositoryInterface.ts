import {SmsVendorResponseModel} from "../../../models";

export interface ISmsVendorResponseRepository {
	create(payload: any): Promise<SmsVendorResponseModel>;
}

export const ISmsVendorResponseRepository = Symbol('ISmsVendorResponseRepository');