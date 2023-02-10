import { ForbiddenKeywordModel } from '../../../models';
import { GetListForbiddenKeywordDto, ForbiddenKeywordDto, UpdateForbiddenKeywordDto } from '../dto/ForbiddenKeywordDto';

export interface IForbiddenKeywordService {
  getListForbiddenKeywords(payload: GetListForbiddenKeywordDto): Promise<[number, ForbiddenKeywordModel[]]>;
  checkKeywordExist(string: string): Promise<string>;
  checkKeywordsExist(strings: string[]): Promise<string>;
  createForbiddenKeyword(payload: ForbiddenKeywordDto): Promise<ForbiddenKeywordModel>;
  updateForbiddenKeyword(
    id: string,
    payload: UpdateForbiddenKeywordDto,
  ): Promise<[number, ForbiddenKeywordModel[]]>;
  deleteForbiddenKeyword(id: string): Promise<void>
}

export const IForbiddenKeywordService = Symbol('IForbiddenKeywordService');
