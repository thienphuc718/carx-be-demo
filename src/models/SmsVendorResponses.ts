import {BelongsTo, Column, CreatedAt, DataType, ForeignKey, Model, PrimaryKey, Table} from "sequelize-typescript";
import {UserModel} from "./Users";

@Table({
	tableName: 'sms_vendor_responses'
})
export class SmsVendorResponseModel extends Model<SmsVendorResponseModel>{
	@PrimaryKey
	@Column({
		type: DataType.UUID,
		defaultValue: DataType.UUIDV4
	})
	id: string;

	@Column({
		type: DataType.STRING
	})
	sms_id: string;

	@Column({
		type: DataType.DATE
	})
	receive_time: Date;

	@Column({
		type: DataType.DATE
	})
	deliver_time: Date;

	@Column({
		type: DataType.INTEGER
	})
	status: number;

	@Column({
		type: DataType.INTEGER
	})
	error_code: number;

	@Column({
		type: DataType.STRING
	})
	carrier: string;

	// NOTE: 0: Thuê bao không đăng ký chuyển mạng giữ số, 1: Thuê bao đang đăng ký chuyển mạng giữ số
	@Column({
		type: DataType.NUMBER
	})
	mnp: number;

	@Column({
		type: DataType.STRING
	})
	from: string;

	@Column({
		type: DataType.STRING
	})
	to: string;

	@Column({
		type: DataType.STRING
	})
	sent_user: string;

	@ForeignKey(() => UserModel)
	@Column({
		type: DataType.UUID
	})
	user_id: string;

	@CreatedAt
	created_at: Date;

	@BelongsTo(() => UserModel)
	user: UserModel;
}