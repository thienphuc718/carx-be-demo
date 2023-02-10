import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user.is_staff) {
      return false;
    }
    const permission = this.reflector.get<string[]>(
      'permission',
      context.getHandler(),
    );
    if (!permission) {
      return false;
    }
    return checkPermission(permission, user);
  }
}

const checkPermission = (permission, user) => {
  const staffPermissions = user.permissions || [];
  const hasPermission = !!staffPermissions.includes(permission);
  return hasPermission;
};
