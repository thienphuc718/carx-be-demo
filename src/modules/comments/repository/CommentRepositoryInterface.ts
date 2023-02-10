import { CommentModel } from '../../../models/Comments';

export interface ICommentRepository {
  create(payload: any): Promise<CommentModel>;
  findAllByCondition(limit: number, offset: number, condition: any): Promise<CommentModel[]>;
  count(condition: any): Promise<number>;
  findById(id: string): Promise<CommentModel>;
}

export const ICommentRepository = Symbol('ICommentRepository');
