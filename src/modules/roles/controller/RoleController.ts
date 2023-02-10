import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiExcludeController } from '@nestjs/swagger';
import { BaseController } from '../../../BaseController';
import { IRoleService } from '../service/RoleServiceInterface';
import * as express from 'express';
import { CreateRoleDto, FilterRoleDto, UpdateRoleDto } from '../dto/RoleDto';
import { Result } from '../../../results/Result';

@ApiTags('Roles')
@Controller('/v1/roles')
export class RoleController extends BaseController {
  constructor(
    @Inject(IRoleService)
    private readonly roleService: IRoleService,
  ) {
    super();
  }

  @Get()
  @ApiOperation({ summary: 'Get All Roles' })
  async getAllRoles(
    @Res() response: express.Response,
    @Query() getRolesDto: FilterRoleDto,
  ) {
    try {
      const roles = await this.roleService.getRoleList(getRolesDto);
      const total = await this.roleService.countRoleByCondition(getRolesDto);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: {
          roles_list: roles.map((role) => role.transformToResponse()),
          total: total,
        },
      });
      return this.ok(response, result.value);
    } catch (error) {
      const err = Result.fail({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
      return this.fail(response, err.error);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Role Detail' })
  async getRoleDetail(
    @Res() response: express.Response,
    @Param('id') roleId: string,
  ) {
    try {
      const role = await this.roleService.getRoleDetail(roleId);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: role.transformToResponse(),
      });
      return this.ok(response, result.value);
    } catch (error) {
      const err = Result.fail({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
      return this.fail(response, err.error);
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create Role' })
  async createNewRole(
    @Res() response: express.Response,
    @Body() createRoleDto: CreateRoleDto,
  ) {
    try {
      const createdRole = await this.roleService.createRole(createRoleDto);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: createdRole,
      });
      return this.ok(response, result.value);
    } catch (error) {
      const err = Result.fail({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
      return this.fail(response, err.error);
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update Role' })
  async updateRole(
    @Res() response: express.Response,
    @Body() updateRoleDto: UpdateRoleDto,
    @Param('id') roleId: string,
  ) {
    try {
      const updatedRole = await this.roleService.updateRole(
        roleId,
        updateRoleDto,
      );
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        data: updatedRole.transformToResponse(),
      });
      return this.ok(response, result.value);
    } catch (error) {
      const err = Result.fail({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
      return this.fail(response, err.error);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete A Role' })
  async deleteRole(
    @Res() response: express.Response,
    @Param('id') roleId: string,
  ) {
    try {
      await this.roleService.deleteRole(roleId);
      const result = Result.ok({
        statusCode: HttpStatus.OK,
        message: 'Successfully deleted a role',
      });
      return this.ok(response, result.value);
    } catch (error) {
      const err = Result.fail({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
      return this.fail(response, err.error);
    }
  }
}
