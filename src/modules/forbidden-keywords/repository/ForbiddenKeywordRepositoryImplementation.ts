import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ForbiddenKeywordModel } from '../../../models';
import { ForbiddenKeywordDto, UpdateForbiddenKeywordDto } from '../dto/ForbiddenKeywordDto';
import { IForbiddenKeywordRepository } from './ForbiddenKeywordRepositoryInterface';

@Injectable()
export class ForbiddenKeywordRepositoryImplementation implements IForbiddenKeywordRepository {
  constructor(
    @InjectModel(ForbiddenKeywordModel) private forbiddenKeywordModel: typeof ForbiddenKeywordModel,
  ) {}

  findAll(): Promise<ForbiddenKeywordModel[]> {
    return this.forbiddenKeywordModel.findAll({
      where: {
        is_deleted: false,
      },
      order: [['created_at', 'desc']],
    });
  }

  findAllByCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<ForbiddenKeywordModel[]> {
    return this.forbiddenKeywordModel.findAll({
      limit,
      offset,
      where: {
        ...condition,
        is_deleted: false,
      },
      order: [['created_at', 'desc']],
    });
  }

  countByCondition(condition: any): Promise<number> {
    return this.forbiddenKeywordModel.count({
      where: {
        ...condition,
        is_deleted: false,
      },
    });
  }

  findById(id: string): Promise<ForbiddenKeywordModel> {
    return this.forbiddenKeywordModel.findByPk(id, {
    });
  }

  create(payload: ForbiddenKeywordDto): Promise<ForbiddenKeywordModel> {
    return this.forbiddenKeywordModel.create(payload);
  }

  delete(id: string): void {
    this.forbiddenKeywordModel.update(
      { is_deleted: true },
      {
        where: {
          id: id,
        },
      },
    );
  }

  update(
    id: string,
    payload: UpdateForbiddenKeywordDto,
  ): Promise<[number, ForbiddenKeywordModel[]]> {
    return this.forbiddenKeywordModel.update(payload, { where: { id }, returning: true });
  }
}
