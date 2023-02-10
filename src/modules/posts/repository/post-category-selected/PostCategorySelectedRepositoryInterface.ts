import { PostCategorySelectedModel } from "../../../../models";

export interface IPostCategorySelectedRepository {
    create(payload: any): Promise<PostCategorySelectedModel>;
    bulkCreate(payload: Array<any>): Promise<PostCategorySelectedModel[]>;
    bulkUpdate(condition: Array<string | number>, payload: any): Promise<[nRowsModified: number]>;
}

export const IPostCategorySelectedRepository = Symbol('IPostCategorySelectedRepository');