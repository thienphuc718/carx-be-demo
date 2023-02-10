import { InsuranceContractRepositoryInterface } from './InsuranceContractRepositoryInterface';
import { InjectModel } from '@nestjs/sequelize';
import { InsuranceContractModel } from '../../../models';

export class InsuranceContractRepositoryImplementation
  implements InsuranceContractRepositoryInterface
{
  constructor(
    @InjectModel(InsuranceContractModel)
    private insuranceContractModel: typeof InsuranceContractModel,
  ) {}

  create(payload: any): Promise<InsuranceContractModel> {
    return this.insuranceContractModel.create(payload);
  }

  findByCondition(condition: any): Promise<InsuranceContractModel> {
    return this.insuranceContractModel.findOne({
      where: {
        ...condition,
      },
    });
  }
}
