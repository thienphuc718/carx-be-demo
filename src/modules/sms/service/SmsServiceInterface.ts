export interface ISmsService {
  send(phoneNumber: string, message: string): Promise<boolean>
}

export const ISmsService = Symbol('ISmsService');
