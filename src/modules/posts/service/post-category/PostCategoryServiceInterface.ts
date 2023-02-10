import { PostCategoryModel } from '../../../../models';
import { CreatePostCategoryDto, FilterPostCategoryDto, UpdatePostCategoryDto } from "../../dto/PostCategoryDto";

export interface IPostCategoryService {
    getPostCategoryList(payload: FilterPostCategoryDto): Promise<PostCategoryModel[]>
    getPostCategoryByCondition(condition: any): Promise<PostCategoryModel>
    countPostCategoryByCondition(condition: any): Promise<number>
    getPostCategoryDetail(id: string): Promise<PostCategoryModel>
    createPostCategory(payload: CreatePostCategoryDto): Promise<PostCategoryModel>
    updatePostCategory(id: string, payload: UpdatePostCategoryDto): Promise<number>
    deletePostCategory(id: string): Promise<void>
}

export const IPostCategoryService = Symbol('IPostCategoryService');
