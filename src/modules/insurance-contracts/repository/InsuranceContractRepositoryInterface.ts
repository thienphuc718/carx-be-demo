import {InsuranceContractModel} from "../../../models";

export interface InsuranceContractRepositoryInterface {
    create(payload: any): Promise<InsuranceContractModel>;
    findByCondition(condition: any): Promise<InsuranceContractModel>
}

export const InsuranceContractRepositoryInterface = Symbol('InsuranceContractRepositoryInterface');