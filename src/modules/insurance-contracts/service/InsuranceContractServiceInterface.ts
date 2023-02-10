import { CreateInsuranceContractDto } from '../dto/InsuranceContractDto';
import { InsuranceContractModel } from '../../../models';

export interface InsuranceContractServiceInterface {
  createInsuranceContract(payload: CreateInsuranceContractDto): Promise<InsuranceContractModel>;
  getInsuranceContractByCondition(condition: any): Promise<InsuranceContractModel>
}

export const InsuranceContractServiceInterface = Symbol(
  'InsuranceContractServiceInterface',
);