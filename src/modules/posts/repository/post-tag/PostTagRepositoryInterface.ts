import { PostTagModel } from "../../../../models";


export interface IPostTagRepository {
  findAll(): Promise<PostTagModel[]>;
  findAllByCondition(limit: number, offset: number, condition: any): Promise<PostTagModel[]>;
  findOneByCondition(condition: any): Promise<PostTagModel>;
  countByCondition(condition: any): Promise<number>;
  findById(id: string): Promise<PostTagModel>;
  create(payload: any): Promise<PostTagModel>;
  update(id: string, payload: any): Promise<any>;
  delete(id: string): void;
}

export const IPostTagRepository = Symbol('IPostTagRepository');
