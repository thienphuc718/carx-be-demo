import { InjectModel } from '@nestjs/sequelize';
import { SectionModel } from '../../../../models';
import { ISectionRepository } from './SectionRepositoryInterface';

export class SectionRepositoryImplementation implements ISectionRepository {
  constructor(
    @InjectModel(SectionModel) private sectionModel: typeof SectionModel,
  ) {}
  countByCondition(condition: any): Promise<number> {
    return this.sectionModel.count({
      where: {
        ...condition,
      }
    })
  }
  findAllByCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<SectionModel[]> {
    return this.sectionModel.findAll({
      limit: limit,
      offset: offset,
      where: {
        ...condition,
      },
      order: [['order', 'asc']],
    });
  }
  findById(id: string): Promise<SectionModel> {
    return this.sectionModel.findByPk(id);
  }
  updateById(id: string, payload: any): Promise<[number, SectionModel[]]> {
    return this.sectionModel.update(payload, {
      where: {
        id: id,
      },
      returning: true,
    });
  }
  findOneByCondition(condition: any): Promise<SectionModel> {
    return this.sectionModel.findOne({
      where: {
        ...condition,
      },
    });
  }
}
