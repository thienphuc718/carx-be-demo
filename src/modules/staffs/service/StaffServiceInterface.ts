import { StaffModel, UserModel } from '../../../models';
import { StaffEntityDto, StaffPayloadDto, FilterStaffDto } from '../dto/StaffDto';
import { SignInDto } from '../../auth/dto/AuthDto';

export interface IStaffService {
  getStaffList(payload: FilterStaffDto): Promise<StaffModel[]>
  getStaffDetails(id: string): Promise<StaffModel>;
  createStaff(payload: StaffPayloadDto): Promise<StaffModel>
  updateStaff(
    id: string,
    payload: StaffPayloadDto,
  ): Promise<StaffModel>;
  changePassword(
    payload: StaffPayloadDto,
    userId: string,
  ): Promise<[number, StaffModel[]]>;
  deleteStaff(id: string): Promise<void>;
  signIn(data: SignInDto): Promise<UserModel>;
  countStaffByCondition(condition: any): Promise<number>;
  isStaffUser(userId: string): Promise<boolean>;
}

export const IStaffService = Symbol('IStaffService');
