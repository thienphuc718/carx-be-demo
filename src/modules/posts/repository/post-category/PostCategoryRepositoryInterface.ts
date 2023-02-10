import { PostCategoryModel } from '../../../../models';

export interface IPostCategoryRepository {
  findAll(): Promise<PostCategoryModel[]>;
  findAllByCondition(limit: number, offset: number, condition: any): Promise<PostCategoryModel[]>;
  findOneByCondition(condition: any): Promise<PostCategoryModel>;
  countByCondition(condition: any): Promise<number>;
  findById(id: string): Promise<PostCategoryModel>;
  create(payload: any): Promise<PostCategoryModel>;
  update(id: string, payload: any): Promise<any>;
  delete(id: string): void;
}

export const IPostCategoryRepository = Symbol('IPostCategoryRepository');
