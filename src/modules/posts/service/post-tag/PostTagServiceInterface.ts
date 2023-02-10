import { PostTagModel } from '../../../../models';
import { CreatePostTagDto, FilterPostTagDto, UpdatePostTagDto } from "../../dto/PostTagDto";

export interface IPostTagService {
    getPostTagList(payload: FilterPostTagDto): Promise<PostTagModel[]>
    getPostTagByCondition(condition: any): Promise<PostTagModel>
    countPostTagByCondition(condition: any): Promise<number>
    getPostTagDetail(id: string): Promise<PostTagModel>
    createPostTag(payload: CreatePostTagDto): Promise<PostTagModel>
    updatePostTag(id: string, payload: UpdatePostTagDto): Promise<number>
    deletePostTag(id: string): Promise<void>
}

export const IPostTagService = Symbol('IPostTagService');
