import { RoleModel } from '../../../models/Roles';
import { CreateRoleDto, FilterRoleDto, UpdateRoleDto } from "../dto/RoleDto";

export interface IRoleService {
    getRoleList(payload: FilterRoleDto): Promise<RoleModel[]>
    getRoleDetail(id: string): Promise<RoleModel>
    createRole(payload: CreateRoleDto): Promise<RoleModel>
    updateRole(id: string, payload: UpdateRoleDto): Promise<RoleModel>
    deleteRole(id: string): Promise<void>
    countRoleByCondition(condition: any): Promise<number>
}

export const IRoleService = Symbol('IRoleService');
