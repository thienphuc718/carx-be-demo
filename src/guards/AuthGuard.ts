import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { verifyJwtToken } from '../helpers/jwtHelper';
import * as express from 'express';
import { UserModel } from '../models/Users';

declare global {
  namespace Express {
    interface User {
      id?: string;
      full_name?: string;
      email?: string;
      username?: string;
      access_level?: string;
      schema?: string;
      is_staff?: boolean;
      permissions?: string[];
    }
    export interface Request {
      user?: User;
    }
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<express.Request>();
    return validateRequest(request);
  }
}

function validateRequest(request: express.Request) {
  if (request.headers.authorization) {
    const [scheme, token] = request.headers.authorization.split(' ');
    if (scheme !== 'Bearer') {
      return false;
    }
    const [isValidToken, tokenPayload] = verifyJwtToken(token);
    if (isValidToken) {
      request.user = tokenPayload;
      return true;
    }
  }
  return false;
}
