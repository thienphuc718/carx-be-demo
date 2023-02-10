import { Inject } from '@nestjs/common';
import { StaffModel, UserModel } from '../../../models';
import {
  StaffEntityDto,
  StaffPayloadDto,
  FilterStaffDto,
} from '../dto/StaffDto';
import { IStaffRepository } from '../repository/StaffRepositoryInterface';
import { IUserService } from '../../users/service/UserServiceInterface';
import { IAuthService } from '../../auth/service/AuthServiceInterface';
import { CreateUserMethodEnum, UserTypeEnum } from '../../users/enum/UserEnum';
import { IStaffService } from './StaffServiceInterface';
import { CARX_SETTING, CARX_MODULES } from '../../../constants';
import { SignInDto } from '../../auth/dto/AuthDto';
import { StaffStatusEnum } from '../enum/StaffEnum';
import { IRoleService } from '../../roles/service/RoleServiceInterface';
import { removeVietnameseTones } from "../../../helpers/stringHelper";

export class StaffServiceImplementation implements IStaffService {
  constructor(
    @Inject(IStaffRepository) private staffRepository: IStaffRepository,
    @Inject(IUserService) private userService: IUserService,
    @Inject(IAuthService) private authService: IAuthService,
    @Inject(IRoleService) private roleService: IRoleService,
  ) {}

  async getStaffList(payload: FilterStaffDto): Promise<StaffModel[]> {
    const { limit, page, ...rest } = payload;
    const queryCondition = this.buildSearchQueryCondition(rest);
    const staffs = await this.staffRepository.findAllByCondition(
      limit,
      (page - 1) * limit,
      queryCondition,
    );
    return staffs;
  }

  getStaffDetails(id: string): Promise<StaffModel> {
    try {
      return this.staffRepository.findOneById(id);
    } catch (error) {
      throw error;
    }
  }

  async isStaffUser(userId: string): Promise<boolean> {
    try {
      const user = await this.userService.getUserDetail(userId, 'public');
      if (!user) {
        throw new Error('User not found');
      }
      if (!user.staff_details) {
        return false;
      }
      return true;
    } catch (error) {
      throw error;
    }
  }

  async createStaff(payload: StaffPayloadDto): Promise<StaffModel> {
    try {
      const { email, role_id, name } = payload;
      // const password = generatePassword();

      let password = null;
      if (payload.password) {
        password = payload.password;
      } else {
        password = CARX_SETTING.DEFAULT_PASSWORD;
      }
      const user = await this.userService.createUser(
        {
          email: email,
          password: password,
          method: CreateUserMethodEnum.EMAIL,
          type: UserTypeEnum.STAFF,
          role_id: role_id,
          company_id: CARX_SETTING.ID,
          full_name: name
        },
        'public',
      );
      if (user) {
        const createdStaff = await this.staffRepository.create({
          ...payload,
          converted_name: removeVietnameseTones(payload.name).split(' ').filter(item => item !== "").join(' '),
          user_id: user.id,
        });
        return this.getStaffDetails(createdStaff.id);
      }
    } catch (error) {
      throw error;
    }
  }

  async updateStaff(id: string, payload: StaffPayloadDto): Promise<StaffModel> {
    try {
      const { role_id , ...rest } = payload;
      const staff = await this.getStaffDetails(id);
      if (!staff) {
        throw new Error('Staff not found');
      }
      const updateStaffPayload: Record<string, any> = {
        ...rest,
      }
      if (payload.name) {
        updateStaffPayload.converted_name = removeVietnameseTones(payload.name).split(' ').filter(item => item !== "").join(' ');
      }
      const user = await this.userService.getUserByCondition({ id: staff.user_id }, 'public');
      if (!user) {
        throw new Error('User not found');
      }
      if (role_id) {
        const role = await this.roleService.getRoleDetail(role_id);
        if (!role) {
          throw new Error('Role not found');
        }
        await this.userService.updateUser(user.id, { role_id: role.id }, 'public');
      }
      if (payload.status === StaffStatusEnum.ACTIVE) {
        await this.userService.enableUser(user.id, 'public');
      }
      if (payload.password) {
        await this.userService.updateUser(user.id, { password: payload.password }, 'public');
        delete updateStaffPayload.password
      }
      if (payload.email) {
        await this.userService.updateUser(user.id, { email: payload.email }, 'public');
      }
      const [nModified, staffs] = await this.staffRepository.update(
          id,
          updateStaffPayload,
      );
      if (!nModified) {
        throw new Error('Fail to update staff');
      }
      return this.getStaffDetails(staffs[0].id);
    } catch (error) {
      throw error;
    }
  }

  async deleteStaff(id: string): Promise<void> {
    try {
      const staff = await this.getStaffDetails(id);
      if (!staff) {
        throw new Error('Staff not found');
      }
      await this.userService.disableUser(staff.user_id, 'public');
      // this.staffRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }

  async changePassword(payload: StaffPayloadDto, userId: string): Promise<any> {
    const user = await this.userService.updateUser(
      userId,
      {
        password: payload.password,
      },
      'public',
    );
    return true;
  }

  async signIn(data: SignInDto): Promise<UserModel> {
    try {
      const user = await this.authService.signIn(data, 'public');
      if (!user.role || user.role.company_id !== CARX_SETTING.ID) {
        throw new Error('staff is not existed');
      }
      if (user.staff_details.status !== StaffStatusEnum.ACTIVE) {
        throw new Error('Staff has been deactivated');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  countStaffByCondition(condition: any): Promise<number> {
    const queryCondition = this.buildSearchQueryCondition(condition);
    return this.staffRepository.count(queryCondition);
  }

  buildSearchQueryCondition(condition: Record<string, any>) {
    let queryCondition = { ...condition };
    const removeKeys = ['limit', 'page'];
    for (const key of Object.keys(queryCondition)) {
      for (const value of removeKeys) {
        if (key === value) {
          delete queryCondition[key];
        }
      }
    }
    return queryCondition;
  }
}
