import { Inject, Injectable } from '@nestjs/common';
import { ForbiddenKeywordModel } from '../../../models/ForbiddenKeywords';
import { GetListForbiddenKeywordDto, ForbiddenKeywordDto, UpdateForbiddenKeywordDto } from '../dto/ForbiddenKeywordDto';
import { IForbiddenKeywordRepository } from '../repository/ForbiddenKeywordRepositoryInterface';
import { IForbiddenKeywordService } from './ForbiddenKeywordServiceInterface';

@Injectable()
export class ForbiddenKeywordServiceImplementation implements IForbiddenKeywordService {

  constructor(
    @Inject(IForbiddenKeywordRepository) private forbiddenKeywordRepository: IForbiddenKeywordRepository,
  ) {}

  async getListForbiddenKeywords(
    query: GetListForbiddenKeywordDto,
  ): Promise<[number, ForbiddenKeywordModel[]]> {
    try {
      const { limit, page, ...condition } = query;
      const result = await Promise.all([
        this.countForbiddenKeywords(condition),
        this.forbiddenKeywordRepository.findAllByCondition(limit, (page - 1) * limit, condition),
      ]);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async checkKeywordExist(string: string): Promise<string> {
    let keywords = await this.forbiddenKeywordRepository.findAll();
    if (!string) {
      return "";
    }
    for(let i = 0; i < keywords.length; i++) {
      if (string.toLowerCase().indexOf(keywords[i].value.toLowerCase()) !== -1) return string;
    }
    return "";
  }

  async checkKeywordsExist(strings: string[]): Promise<string> {
    let keywords = await this.forbiddenKeywordRepository.findAll();
    if (!strings.length || !keywords.length) {
      return "";
    } 
    for(let j = 0; j < strings.length; j++) {
      let string = strings[j]?.toLowerCase() || '';
      for(let i = 0; i < keywords.length; i++) {
        if (string.indexOf(keywords[i].value.toLowerCase()) !== -1) {
          return string;
        };
      }
    }
    return "";
  }

  async countForbiddenKeywords(condition: any) {
    try {
      const count = await this.forbiddenKeywordRepository.countByCondition(condition);
      return count;
    } catch (error) {
      throw error;
    }
  }

  async createForbiddenKeyword(payload: ForbiddenKeywordDto): Promise<ForbiddenKeywordModel> {
    try {
      const forbiddenKeyword = await this.forbiddenKeywordRepository.create(payload);
      if (!forbiddenKeyword) {
        throw new Error('Cannot create ForbiddenKeyword');
      }
      return forbiddenKeyword;
    } catch (error) {
      throw error;
    }
  }

  async updateForbiddenKeyword(
    id: string,
    payload: UpdateForbiddenKeywordDto,
  ): Promise<[number, ForbiddenKeywordModel[]]> {
    try {
      const forbiddenKeyword = await this.forbiddenKeywordRepository.findById(id);
      if (!forbiddenKeyword) {
        throw new Error('forbidden keyword does not exist');
      }
      return this.forbiddenKeywordRepository.update(id, payload);;
    } catch (error) {
      throw error;
    }
  }

  async deleteForbiddenKeyword(id: string): Promise<void> {
    try {
      return this.forbiddenKeywordRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }
}
