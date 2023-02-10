import { CommentModel } from '../../../models/Comments';
import { CreateCommentPayloadDto, FilterCommentDto } from "../dto/CommentDto";

export interface ICommentService {
    createComment(payload: CreateCommentPayloadDto): Promise<CommentModel>
    getCommentListByCondition(payload: FilterCommentDto): Promise<CommentModel[]>
    countCommentByCondition(condition: any): Promise<number>
}

export const ICommentService = Symbol('ICommentService');
