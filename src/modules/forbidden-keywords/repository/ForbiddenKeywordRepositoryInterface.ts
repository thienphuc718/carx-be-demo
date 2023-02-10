import { ForbiddenKeywordModel } from '../../../models/ForbiddenKeywords';
import { ForbiddenKeywordDto, UpdateForbiddenKeywordDto } from '../dto/ForbiddenKeywordDto';

export interface IForbiddenKeywordRepository {
  findAll(): Promise<ForbiddenKeywordModel[]>;
  findAllByCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<ForbiddenKeywordModel[]>;
  countByCondition(condition: any): Promise<number>;
  findById(id: string): Promise<ForbiddenKeywordModel>;
  create(payload: ForbiddenKeywordDto): Promise<ForbiddenKeywordModel>;
  update(
    id: string,
    payload: UpdateForbiddenKeywordDto,
  ): Promise<[number, ForbiddenKeywordModel[]]>;
  delete(id: string): void;
}

export const IForbiddenKeywordRepository = Symbol('IForbiddenKeywordRepository');
