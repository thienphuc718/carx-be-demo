import { InsuranceProductRepositoryInterface } from './InsuranceProductRepositoryInterface';
import { InjectModel } from '@nestjs/sequelize';
import { InsuranceProductModel } from '../../../../models/InsuranceProducts';

export class InsuranceProductRepositoryImplementation
  implements InsuranceProductRepositoryInterface
{
  constructor(
    @InjectModel(InsuranceProductModel)
    private insuranceProductModel: typeof InsuranceProductModel,
  ) {}

  create(payload: any): Promise<InsuranceProductModel> {
    return this.insuranceProductModel.create(payload);
  }

  deleteById(id: string): Promise<number> {
    return this.insuranceProductModel.destroy({ where: { id: id } });
  }

  findAllByCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<InsuranceProductModel[]> {
    return this.insuranceProductModel.findAll({
      limit: limit,
      offset: offset,
      where: {
        ...condition,
      },
    });
  }

  findById(id: string): Promise<InsuranceProductModel> {
    return this.insuranceProductModel.findByPk(id);
  }

  updateById(
    id: string,
    payload: any,
  ): Promise<[number, InsuranceProductModel[]]> {
    return this.insuranceProductModel.update(payload, {
      where: {
        id: id,
      },
      returning: true,
    });
  }

  findAllByConditionWithoutPagination(
    condition: any,
  ): Promise<InsuranceProductModel[]> {
    return this.insuranceProductModel.findAll({
      where: {
        ...condition,
      },
    });
  }

  findOneByCondition(condition: any): Promise<InsuranceProductModel> {
    return this.insuranceProductModel.findOne({
      where: {
        ...condition,
      }
    })
  }
}