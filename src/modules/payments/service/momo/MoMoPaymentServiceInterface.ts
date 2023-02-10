import { CreateMoMoPaymentMethodRequestType } from "../../type/MoMoPaymentType";


export interface IMoMoPaymentService {
    createPaymentMethodRequest(payload: CreateMoMoPaymentMethodRequestType) : Promise<any>
}

export const IMoMoPaymentService = Symbol('IMoMoPaymentService');