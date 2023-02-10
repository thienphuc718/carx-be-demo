import { Inject, Injectable, Scope } from '@nestjs/common';
import { UserModel } from '../../../models/Users';

import { generateJwtToken, getJwtPayload } from '../../../helpers/jwtHelper';
import {
  comparePassword,
  hashingPassword,
} from '../../../helpers/passwordHelper';

import {
  FilterUserDto,
  UserPayloadDto,
  UpdateUserDto,
  CreateSocialUserDto,
  ChangePasswordDto,
} from '../dto/UserDto';

import { CreateUserMethodEnum, UserTypeEnum } from '../enum/UserEnum';

import { ICompanyRepository } from '../../companies/repository/CompanyRepositoryInterface';
import { IUserRepository } from '../repository/user/UserRepositoryInterface';
import { IUserService } from './UserServiceInterface';
import { v4 as uuidv4 } from 'uuid';
import { IUserCompanyRelationsRepository } from '../repository/user-company-relations/UserCompanyRelationsRepositoryInterface';
import { validateEmail } from '../../../helpers/emailHelper';
import { IAgentRepository } from '../../agents/repository/AgentRepositoryInterface';
import { ICarService } from '../../cars/service/CarServiceInterface';
import { ICustomerService } from '../../customers/service/customer/CustomerServiceInterface';
import { CreateAgentEntityDto } from '../../agents/dto/AgentDto';
import { IForbiddenKeywordService } from '../../forbidden-keywords/service/ForbiddenKeywordServiceInterface';

@Injectable()
export class UserServiceImplementation implements IUserService {
  constructor(
    @Inject(IUserRepository)
    private userRepository: IUserRepository,
    @Inject(IUserCompanyRelationsRepository)
    private userCompanyRelationRepository: IUserCompanyRelationsRepository,
    @Inject(ICompanyRepository) private companyRepository: ICompanyRepository,
    @Inject(IAgentRepository) private agentRepository: IAgentRepository,
    @Inject(ICarService) private carService: ICarService,
    @Inject(ICustomerService) private customerService: ICustomerService,
    @Inject(IForbiddenKeywordService)
    private forbiddenKeywordService: IForbiddenKeywordService,
  ) { }

  async createSocialUser(
    payload: CreateSocialUserDto,
    schema: string,
  ): Promise<UserModel> {
    try {
      if (!payload.user) {
        throw new Error('User information is required');
      }

      if (validateEmail(payload.user.email)) {
        const user = await this.userRepository.findOneByCondition(
          { email: payload.user.email },
          schema,
        );
        if (user) {
          user.social_info.push({
            ...payload.user,
            provider: payload.provider,
            access_token: payload.token,
          });
          user.changed('social_info', true);
          return user.save();
        } else {
          const params: Record<string, any> = {
            id: uuidv4(),
            first_name: payload.user.given_name,
            last_name: payload.user.family_name,
            social_info: [
              {
                gender: payload.user.gender,
                google_user_id: payload.user.id,
                avatar: payload.user.picture,
                provider: payload.provider,
                access_token: payload.token,
              },
            ],
            email: payload.user.email,
          };
          const createdUser = await this.userRepository.create(params, schema);
          return createdUser;
        }
      } else {
        throw new Error('Email not valid');
      }
    } catch (error) {
      throw error;
    }
  }

  async getUserList(
    payload: FilterUserDto,
    schema: string,
  ): Promise<UserModel[]> {
    const { limit, page } = payload;
    const users = await this.userRepository.findAllByCondition(
      limit,
      (page - 1) * limit,
      {},
      schema,
    );
    return users;
  }

  async getUserDetail(id: string, schema: string): Promise<UserModel> {
    return this.userRepository.findById(id, schema);
  }

  async createUser(payload: UserPayloadDto, schema: string): Promise<UserModel> {
    try {
      const token: string = generateJwtToken(getJwtPayload(payload));
      const hashedPassword: string = await hashingPassword(payload.password);
      const params: Record<string, any> = {
        id: uuidv4(),
        ...payload,
        token,
        password: hashedPassword,
      };
      if (payload.type == UserTypeEnum.AGENT || payload.type === UserTypeEnum.CUSTOMER) {
        const [createdUser, company] = await Promise.all([
          await this.userRepository.create(
            params,
            schema,
          ),
          await this.companyRepository.create({ name: '' }),
        ]);
        if (company) {
          if (payload.type === UserTypeEnum.AGENT) {
            const createAgentPayload: CreateAgentEntityDto = {
              user_id: createdUser.id,
            };
            await Promise.all([
              await this.agentRepository.create(createAgentPayload),
              await this.userCompanyRelationRepository.create({
                user_id: createdUser.id,
                company_id: company.id,
              })
            ]);
          } else if (payload.type === UserTypeEnum.CUSTOMER) {
            const [customer, companyRelation] = await Promise.all([
              await this.customerService.createCustomer({
                user_id: createdUser.id,
                ...payload
              }, schema),
              await this.userCompanyRelationRepository.create({
                user_id: createdUser.id,
                company_id: company.id,
              })
            ])
            if (customer) {
              await this.carService.createCar(
                { customer_id: customer.id }
              );
            }
          }
        }
        return createdUser;
      } else if (payload.type === 'STAFF') {
        const createdUser = await this.userRepository.create(
          params,
          schema,
        );
        await this.userCompanyRelationRepository.create({
          user_id: createdUser.id,
          company_id: payload.company_id,
          role_id: payload.role_id
        });
        return createdUser;
      }
    }
    catch (error) {
      throw error;
    }
  }

  countUserByCondition(condition: any, schema: string): Promise<number> {
    return this.userRepository.countByCondition(condition, schema);
  }

  getUserByCondition(condition: any, schema: string): Promise<UserModel> {
    return this.userRepository.findOneByCondition(condition, schema);
  }

  async updateUser(
    id: string,
    payload: UpdateUserDto,
    schema: string,
  ): Promise<UserModel> {
    try {
      if (payload.password) {
        payload.password = await hashingPassword(payload.password);
      }
      if (payload.full_name) {
        const checkForbiddenKeyword = 
          await this.forbiddenKeywordService.checkKeywordExist(payload.full_name);
        if (checkForbiddenKeyword) {
          let data = {
            message: 'Forbidden keywords exists',
            value: checkForbiddenKeyword,
            code: 'FORBIDDEN_KEYWORD_ERROR'
          }
          throw data;
        }
      }
      const [nModified, updatedUsers] = await this.userRepository.update(id, payload, schema);
      if (!nModified) {
        throw new Error('Update user failed');
      }
      return updatedUsers[0];
    } catch (error) {
      throw error;
    }
  }

  async updatePersonalInfo(
    id: string,
    payload: UpdateUserDto,
    schema: string,
  ): Promise<UserModel> {
    try {
      const user = await this.getUserDetail(id, schema);
      if (user) {
        if (payload.password) {
          payload.password = await hashingPassword(payload.password);
        }
        const [nModified, updatedUsers] = await this.userRepository.update(id, payload, schema);
        if (!nModified) {
          throw new Error('Update user failed');
        }
        return updatedUsers[0];
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      throw error;
    }
  }

  // Disable User
  async disableUser(id: string, schema: string): Promise<void> {
    const user = await this.getUserDetail(id, schema);
    if (!user) {
      throw new Error('User not found');
    }
    const agent = user.agent_details;
    const customer = user.customer_details;
    const staff = user.staff_details;
    if (agent) {
      // agent.is_deleted = true;
      agent.is_hidden = true;
      await agent.save();
    } else if (customer) {
      customer.is_deleted = true;
      await customer.save();
    } else {
      staff.is_deleted = true;
      await staff.save();
    }
    this.userRepository.delete(id, schema);
  }

  async enableUser(id: string, schema: string): Promise<void> {
    const user = await this.getUserDetail(id, schema);
    if (!user) {
      throw new Error('User not found');
    }
    user.is_deleted = false;
    await user.save();
  }

  async changePassword(id: string, payload: ChangePasswordDto, schema: string): Promise<boolean> {
    try {
      const { current_password, new_password } = payload;
      if (current_password === new_password) {
        throw new Error('New password cannot be the same as old password');
      }
      const user = await this.getUserByCondition({ id: id }, schema);
      if (!user) {
        throw new Error('User not found');
      }
      const isPasswordCorrect = await comparePassword(current_password, user.password);
      if (!isPasswordCorrect) {
        throw new Error('Password is not equal to current password');
      } else {
        const newHashedPassword: string = await hashingPassword(new_password);
        await this.userRepository.update(user.id, { password: newHashedPassword }, schema);
        return true;
      }
    } catch (error) {
      throw error;
    }
  }

  getUserListByConditionWithoutPagination(condition: any, schema: string): Promise<UserModel[]> {
    return this.userRepository.findAllByConditionWithoutPagination(condition, schema); 
  }

  // Delete user
  async hardDeleteUser(userId: string, schema: string): Promise<{ message: string }> {
    try {
      const user = await this.getUserDetail(userId, schema);
      const userCompanyRelation = await this.userCompanyRelationRepository.findOneByCondition({
        user_id: userId,
      });
      const company = await this.companyRepository.findById(userCompanyRelation.company_id);
      if (!company || !userCompanyRelation) {
        throw new Error('User does not have company');
      }
      await company.destroy({ force: true });
      await user.destroy({ force: true });
      return { message: 'Completely delete User' };
    } catch (error) {
      throw error;
    }
  }
}
