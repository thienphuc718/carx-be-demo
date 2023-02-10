import { Inject, Injectable } from '@nestjs/common';
import { RoleModel } from '../../../models/Roles';

import { FilterRoleDto, CreateRoleDto, UpdateRoleDto } from '../dto/RoleDto';
import { IRoleRepository } from '../repository/RoleRepositoryInterface';
import { IRoleService } from './RoleServiceInterface';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';
import { IUserService } from '../../users/service/UserServiceInterface';
import {removeVietnameseTones} from "../../../helpers/stringHelper";

@Injectable()
export class RoleServiceImplementation implements IRoleService {
  constructor(
    @Inject(IRoleRepository)
    private roleRepository: IRoleRepository,
    @Inject(IUserService) private userService: IUserService
  ) {}

  async getRoleList(payload: FilterRoleDto): Promise<RoleModel[]> {
    try {
      const { limit, page, ...rest } = payload;
      const queryCondition = this.buildSearchQueryCondition(rest);
      const roles = await this.roleRepository.findAllByCondition(
        limit,
        page,
        queryCondition,
      );
      return roles;
    } catch (error) {
      throw error;
    }
  }

  async getRoleDetail(id: string): Promise<RoleModel> {
    try {
      const details = await this.roleRepository.findById(id);
      return details;
    } catch (error) {
      throw error;
    }
  }

  async createRole(payload: CreateRoleDto): Promise<RoleModel> {
    try {
      const createdRole = await this.roleRepository.create({
        ...payload,
        converted_name: removeVietnameseTones(payload.name).split(' ').filter(item => item !== "").join(' '),
      });
      if (createdRole) {
        const { feature_ids } = payload;
        await this.roleRepository.bulkCreateRoleFeatures(
          feature_ids.map((feature_id) => ({
            role_id: createdRole.id,
            feature_id,
          })),
        );
      } else {
        throw new Error('Can not create role');
      }
      return this.getRoleDetail(createdRole.id);
    } catch (error) {
      throw error;
    }
  }

  async updateRole(id: string, payload: UpdateRoleDto): Promise<RoleModel> {
    try {
      const { feature_ids, ...rest } = payload;
      if (feature_ids && feature_ids.length) {
        const deleteRoleFeatureParams = {
          role_id: id,
        };
        const nModified = await this.roleRepository.deleteRoleFeature(
          deleteRoleFeatureParams,
        );
        if (!nModified) {
          throw new Error(`Cannot update role with id: ${id}`);
        }
      }
      const createRoleFeaturePayload = feature_ids?.length
        ? feature_ids.map((feature_id) => ({ role_id: id, feature_id }))
        : [];
      const params: Record<string, any> = {
        ...rest,
      }
      if (payload.name) {
        params.converted_name = removeVietnameseTones(payload.name).split(' ').filter(item => item !== "").join(' ');
      }
      await Promise.all([
        this.roleRepository.update(id, params),
        this.roleRepository.bulkCreateRoleFeatures(createRoleFeaturePayload),
      ]);
      return this.getRoleDetail(id);
    } catch (error) {
      throw error;
    }
  }

  async deleteRole(id: string): Promise<void> {
    try {
      const role = await this.getRoleDetail(id);
      const users = await this.userService.getUserListByConditionWithoutPagination({
        role_id: role.id,
      }, 'public');
      if (users.length > 0) {
        throw new Error(`Cannot delete role. User might be still in use`);
      }
      if (!role) {
        throw new Error('Role not found');
      }
      this.roleRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }

  countRoleByCondition(condition: any): Promise<number> {
    const queryCondition = this.buildSearchQueryCondition(condition);
    return this.roleRepository.countByCondition(queryCondition);
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
