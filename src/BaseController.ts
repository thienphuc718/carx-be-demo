import * as express from 'express';

interface Error {
  statusCode: number;
  message: string;
  errorCode?: string;
  data?: any;
}

interface ErrorResp {
  error: Error;
}

enum STATUS_CODE {
  SUCCESS = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  PAYMENT_REQUIRED = 402,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  TOO_MANY_REQUESTS = 429,
  SERVER_INTERNAL_ERROR = 500,
}

const MessageStatusMapping: Record<number, string> = {
  [STATUS_CODE.SUCCESS]: 'Success',
  [STATUS_CODE.CREATED]: 'Created',
  [STATUS_CODE.BAD_REQUEST]: 'Bad Request',
  [STATUS_CODE.UNAUTHORIZED]: 'Unauthorized',
  [STATUS_CODE.PAYMENT_REQUIRED]: 'Payment required',
  [STATUS_CODE.FORBIDDEN]: 'Forbidden',
  [STATUS_CODE.NOT_FOUND]: 'Not found',
  [STATUS_CODE.CONFLICT]: 'Conflict',
  [STATUS_CODE.TOO_MANY_REQUESTS]: 'Too many requests',
  [STATUS_CODE.SERVER_INTERNAL_ERROR]: 'Server internal error',
};

export abstract class BaseController {
  public static jsonResponse(
    res: express.Response,
    code: STATUS_CODE,
    message?: string,
  ) {
    const returnMessage: string = message
      ? message
      : MessageStatusMapping[code];
    return res.status(code).json({ message: returnMessage });
  }

  public ok<T>(res: express.Response, dto?: T): express.Response<T> {
    if (!!dto) {
      res.type('application/json');
      return res.status(STATUS_CODE.SUCCESS).json(dto);
    } else {
      return res.sendStatus(STATUS_CODE.SUCCESS);
    }
  }

  public created(res: express.Response) {
    return res.sendStatus(STATUS_CODE.CREATED);
  }

  public clientError(res: express.Response, message?: string) {
    return BaseController.jsonResponse(res, STATUS_CODE.BAD_REQUEST, message);
  }

  public unauthorized(res: express.Response, message?: string) {
    return BaseController.jsonResponse(res, STATUS_CODE.UNAUTHORIZED, message);
  }

  public paymentRequired(res: express.Response, message?: string) {
    return BaseController.jsonResponse(
      res,
      STATUS_CODE.PAYMENT_REQUIRED,
      message,
    );
  }

  public forbidden(res: express.Response, message?: string) {
    return BaseController.jsonResponse(res, STATUS_CODE.FORBIDDEN, message);
  }

  public notFound(res: express.Response, message?: string) {
    return BaseController.jsonResponse(res, STATUS_CODE.NOT_FOUND, message);
  }

  public conflict(res: express.Response, message?: string) {
    return BaseController.jsonResponse(res, STATUS_CODE.CONFLICT, message);
  }

  public tooMany(res: express.Response, message?: string) {
    return BaseController.jsonResponse(
      res,
      STATUS_CODE.TOO_MANY_REQUESTS,
      message,
    );
  }

  public fail(res: express.Response, error: Error) {
    return res.status(error.statusCode).json({
      statusCode: error.statusCode,
      message: [error.message],
      errorCode: error.errorCode,
      data: error.data,
    });
  }

  public badRequest(res: express.Response, message: string) {
    return res.status(STATUS_CODE.BAD_REQUEST).json({
      statusCode: STATUS_CODE.BAD_REQUEST,
      message,
    });
  }
}
