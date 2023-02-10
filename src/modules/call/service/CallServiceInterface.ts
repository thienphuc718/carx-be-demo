export interface ICallService {
    call(phoneNumber: string, message: string): Promise<boolean>
}

export const ICallService = Symbol('ICallService');