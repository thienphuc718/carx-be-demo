import { PostModel } from '../../../../models';
import { CreatePostDto, FilterCommunityPostDto, FilterPostDto, UpdatePostDto } from "../../dto/PostDto";

export interface IPostService {
    getPostList(payload: FilterPostDto): Promise<PostModel[]> // tin tức -> FE query string type: ADMIN_POST
    /**
     * 
     * PostCommunityResponse extends PostModel {
     *  total_like: number;
     *  total_comment: number;
     *  is_liked: boolean;
     * }
     *  getCommunityPostList(payload: FilterPostDto): Promise<PostCommunityResponse[]>
     *  Tách API -> /api/v1/posts/communities (set cứng type = 'USER_POST')
     */
    getCommunityPostList(payload: FilterCommunityPostDto, userId: string): Promise<Array<PostModel>>
    getPostByCondition(condition: any): Promise<PostModel>
    countPostByCondition(condition: any): Promise<number>
    getPostDetail(id: string): Promise<PostModel>
    createPost(payload: CreatePostDto): Promise<PostModel>
    updatePost(id: string, payload: UpdatePostDto): Promise<number>
    deletePost(id: string): Promise<void>
}

export const IPostService = Symbol('IPostService');
