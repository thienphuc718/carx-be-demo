import { Inject } from '@nestjs/common';
import { InsuranceContractServiceInterface } from './InsuranceContractServiceInterface';
import { InsuranceContractRepositoryInterface } from '../repository/InsuranceContractRepositoryInterface';
import { CreateInsuranceContractDto } from '../dto/InsuranceContractDto';
import { InsuranceContractModel } from '../../../models';

export class InsuranceContractServiceImplementation
  implements InsuranceContractServiceInterface
{
  constructor(
    @Inject(InsuranceContractRepositoryInterface)
    private insuranceContractRepository: InsuranceContractRepositoryInterface,
  ) {}

  createInsuranceContract(
    payload: CreateInsuranceContractDto,
  ): Promise<InsuranceContractModel> {
    try {
      return this.insuranceContractRepository.create(payload);
    } catch (error) {
      throw error;
    }
  }

  getInsuranceContractByCondition(
    condition: any,
  ): Promise<InsuranceContractModel> {
    return this.insuranceContractRepository.findByCondition(condition);
  }
}