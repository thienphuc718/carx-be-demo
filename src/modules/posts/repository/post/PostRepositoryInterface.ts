import { PostModel } from '../../../../models';

export interface IPostRepository {
  findAll(): Promise<PostModel[]>;
  findAllByCondition(limit: number, offset: number, condition: any): Promise<PostModel[]>;
  findOneByCondition(condition: any): Promise<PostModel>;
  countByCondition(condition: any): Promise<number>;
  findById(id: string): Promise<PostModel>;
  create(payload: any): Promise<PostModel>;
  update(id: string, payload: any): Promise<any>;
  delete(id: string): void;
  // include like + comments -> transfer to total
  findAllByConditionV2(limit: number, offset: number, condition: any): Promise<PostModel[]>;
}

export const IPostRepository = Symbol('IPostRepository');
