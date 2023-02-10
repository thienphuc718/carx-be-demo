import { UserModel } from '../../../models/Users';
import {
  ChangePasswordDto,
  CreateSocialUserDto,
  UserPayloadDto,
  FilterUserDto,
  UpdateUserDto,
} from '../dto/UserDto';

export interface IUserService {
  getUserList(payload: FilterUserDto, schema: string): Promise<UserModel[]>;
  getUserListByConditionWithoutPagination(
    condition: any,
    schema: string,
  ): Promise<UserModel[]>;
  getUserByCondition(condition: any, schema: string): Promise<UserModel>;
  countUserByCondition(condition: any, schema: string): Promise<number>;
  getUserDetail(id: string, schema: string): Promise<UserModel>;
  createUser(payload: UserPayloadDto, schema: string): Promise<UserModel>;
  updateUser(
    id: string,
    payload: UpdateUserDto,
    schema: string,
  ): Promise<UserModel>;
  disableUser(id: string, schema: string): Promise<void>;
  createSocialUser(
    payload: CreateSocialUserDto,
    schema: string,
  ): Promise<UserModel>;
  updatePersonalInfo(
    id: string,
    payload: UpdateUserDto,
    schema: string,
  ): Promise<UserModel>;
  changePassword(
    id: string,
    payload: ChangePasswordDto,
    schema: string,
  ): Promise<boolean>;
  hardDeleteUser(userId: string, schema: string): Promise<{ message: string }>
  enableUser(id: string, schema: string): Promise<void>
}

export const IUserService = Symbol('IUserService');
