import {ISmsVendorResponseRepository} from "./SmsVendorResponseRepositoryInterface";
import {InjectModel} from "@nestjs/sequelize";
import {SmsVendorResponseModel} from "../../../models";

export class SmsVendorResponseRepositoryImplementation implements ISmsVendorResponseRepository {
	constructor(@InjectModel(SmsVendorResponseModel) private smsVendorResponseModel: typeof SmsVendorResponseModel) {}
	create(payload: any): Promise<SmsVendorResponseModel> {
		return this.smsVendorResponseModel.create(payload);
	}
}