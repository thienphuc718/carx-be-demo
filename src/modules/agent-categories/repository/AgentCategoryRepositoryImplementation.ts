import { InjectModel } from '@nestjs/sequelize';
import { AgentCategoryModel } from '../../../models';
import { IAgentCategoryRepository } from './AgentCategoryRepositoryInterface';

export class AgentCategoryRepositoryImplementation
  implements IAgentCategoryRepository
{
  constructor(
    @InjectModel(AgentCategoryModel)
    private agentCategoryModel: typeof AgentCategoryModel,
  ) {}

  findAllWithCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<AgentCategoryModel[]> {
    return this.agentCategoryModel.findAll({
      limit: limit,
      offset: offset,
      where: {
        ...condition,
        is_deleted: false,
      },
      order: [['order', 'asc']],
    });
  }
  findById(id: string): Promise<AgentCategoryModel> {
    return this.agentCategoryModel.findByPk(id);
  }
  create(payload: any): Promise<AgentCategoryModel> {
    return this.agentCategoryModel.create(payload);
  }
  update(id: string, payload: any): Promise<[number, AgentCategoryModel[]]> {
    return this.agentCategoryModel.update(payload, {
      where: {
        id: id,
      },
      returning: true,
    });
  }
  countByCondition(condition: any): Promise<number> {
    return this.agentCategoryModel.count({
      where: {
        ...condition,
        is_deleted: false,
      },
    });
  }
  delete(id: string): void {
    this.agentCategoryModel.update({ is_deleted: true }, { where: { id: id } });
  }
  findOneByCondition(condition: any): Promise<AgentCategoryModel> {
    return this.agentCategoryModel.findOne({
      where: {
        ...condition,
        is_deleted: false,
      }
    })
  }
}
