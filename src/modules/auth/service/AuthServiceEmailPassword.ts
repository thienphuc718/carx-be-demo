import { Inject, Injectable } from '@nestjs/common';

import {
  SignUpEmailPasswordDto,
  SignInEmailPasswordDto,
  SignInResponseDto
} from '../dto/AuthDto';

import {
  CreateUserMethodEnum
} from '../../users/enum/UserEnum';

import {
  generateJwtToken,
  getJwtPayload
} from '../../../helpers/jwtHelper';
import { comparePassword, hashingPassword } from '../../../helpers/passwordHelper';

import { UserModel } from '../../../models/Users';

import { IAuthService } from './AuthServiceInterface';
import { IUserService } from '../../users/service/UserServiceInterface';
import { v4 as uuidv4 } from 'uuid';
import { Result } from '../../../results/Result';

export class AuthServiceEmailPassword {
  constructor(
    @Inject(IUserService)
    private userService: IUserService
  ) {
  }

  async signUp(data: SignUpEmailPasswordDto, schema: string): Promise<UserModel> {
    try {
      const countUser = await this.userService.countUserByCondition({
        email: data.email
      }, schema);
      if (!countUser) {
        const user = this.userService.createUser({
          ...data,
          method: CreateUserMethodEnum.EMAIL
        }, schema);
        return user;
      } else {
        throw new Error('User already exists');
      }
    } catch (error) {
      throw error;
    }
  }

  async signIn(data: SignInEmailPasswordDto, schema: string): Promise<UserModel> {
    try {
      const existedUser = await this.userService.getUserByCondition({
        email: data.email
      }, schema);
      if (!existedUser) {
        throw new Error('User does not exist');
      }
      const isPasswordCorrect: boolean = await comparePassword(
        data.password,
        existedUser.password,
      );
      if (!isPasswordCorrect) {
        throw new Error('Password is not correct');
      }
      // TODO: hard code for test schema
      existedUser.schema = 'public';
      const token: string = generateJwtToken(getJwtPayload(existedUser));
      await this.userService.updateUser(existedUser.id, { ...existedUser, token }, schema);
      return this.userService.getUserDetail(existedUser.id, schema);
    } catch (error) {
      throw error;
    }
  }
}
