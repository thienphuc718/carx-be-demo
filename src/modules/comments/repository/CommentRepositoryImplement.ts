import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from '../../../models';
import { CommentModel } from '../../../models/Comments';
import { ICommentRepository } from './CommentRepositoryInterface';

@Injectable()
export class CommentRepositoryImplementation implements ICommentRepository {
  constructor(
    @InjectModel(CommentModel) private commentsModel: typeof CommentModel,
  ) {}

  
  create(payload: any): Promise<CommentModel> {
    return this.commentsModel.create(payload);
  }

  findAllByCondition(limit: number, offset: number, condition: any): Promise<CommentModel[]> {
    return this.commentsModel.findAll({
      limit: limit,
      offset: offset,
      where: {
        ...condition,
        is_deleted: false,
      },
      include: [
        {
          model: UserModel,
          as: 'user',
          attributes: ['id', 'full_name', 'avatar'],
        }
      ],
      order: [['updated_at', 'desc']],
    })
  }

  count(condition: any): Promise<number> {
    return this.commentsModel.count({
      where: {
        ...condition,
        is_deleted: false,
      }
    })
  }
  findById(id: string): Promise<CommentModel> {
    return this.commentsModel.findOne({
      where: {
        id: id,
        is_deleted: false,
      },
      include: [
        {
          model: UserModel,
          as: 'user',
          attributes: ['id', 'full_name', 'avatar'],
        }
      ],
    })
  }
}
