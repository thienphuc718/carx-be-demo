import * as express from 'express';
import * as jsonwebtoken from 'jsonwebtoken';
const crypto = require('crypto');

import { Result } from '../results/Result';

export function getJwtPayload(userData) {
  const is_staff = !!userData.staff_details;
  const rolePermissions = userData.role?.permissions || [];
  const permissions = rolePermissions.map(
    (permission) => permission?.feature?.module,
  );
  return {
    id: userData.id,
    full_name: userData.full_name,
    email: userData.email,
    username: userData.username,
    access_level: userData.access_level,
    schema: userData.schema,
    is_staff,
    permissions,
  };
}

export function generateJwtToken(tokenPayload) {
  return jsonwebtoken.sign(tokenPayload, process.env.JWT_SECRET, {
    expiresIn: '365 days',
  });
}

export function verifyJwtToken(token: string): [boolean, unknown] {
  return [
    decodeJwtToken(token).isSuccess,
    decodeJwtToken(token).isSuccess ? decodeJwtToken(token).value : null,
  ];
}

export function decodeJwtToken(token: string) {
  try {
    return Result.ok(jsonwebtoken.verify(token, process.env.JWT_SECRET));
  } catch (error) {
    return Result.fail({
      statusCode: 400,
      message: 'Invalid jwt token',
    });
  }
}

export function getTokenFromRequestHeader(request: express.Request): string {
  if (request.headers.authorization) {
    const [_, token] = request.headers.authorization.split(' ');

    const [isValidToken] = verifyJwtToken(token);
    if (isValidToken) {
      //@ts-ignore
      return token;
    }
  }
}

export function getSchemaFromRequestHeader(request: express.Request): string {
  if (request.headers.authorization) {
    const [_, token] = request.headers.authorization.split(' ');

    const [isValidToken, tokenPayload] = verifyJwtToken(token);

    if (isValidToken) {
      //@ts-ignore
      return tokenPayload.schema;
    }
  }
}

export function getSchemaFromUrl(request: express.Request): string {
  const domains = request.subdomains;
  let schema = ['development', 'staging'].includes(process.env.NODE_ENV)
    ? 'public'
    : domains[0];
  if (schema) return schema;
  return 'public';
}

export function generateUrboxSignature(params) {
  const sorted = Object.create({});
  Object.keys(params)
    .sort()
    .forEach(function (key) {
      sorted[key] = params[key];
    });
  const encode = JSON.stringify(sorted);
  const signer = crypto.createSign('RSA-SHA256');
  signer.write(encode);
  signer.end();
  const privateKey = process.env.URBOX_PRIVATE_KEY.replace(/\\n/g, '\n');
  const signature = signer.sign(privateKey, 'base64');
  return signature;
}

export function generateStringeeToken(userId?: string) {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + 2592000;

  const header = {
    cty: 'stringee-api;v=1',
    typ: 'JWT',
    alg: 'HS256',
  };

  let payload: Record<string, any> = {
    jti: process.env.STRINGEE_API_KEY + '-' + now,
    iss: process.env.STRINGEE_API_KEY,
    exp: exp,
  };

  if (userId) {
    payload.userId = userId; // get client access token
  } else {
    payload.rest_api = true; // get rest api access token
  }

  const token = jsonwebtoken.sign(payload, process.env.STRINGEE_API_SECRET, {
    header: header,
  });
  return token;
}
