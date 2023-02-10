import { PostTagSelectedModel } from "../../../../models";

export interface IPostTagSelectedRepository {
    create(payload: any): Promise<PostTagSelectedModel>;
    bulkCreate(payload: Array<any>): Promise<PostTagSelectedModel[]>;
    bulkUpdate(condition: Array<string | number>, payload: any): Promise<[nRowsModified: number]>;
}

export const IPostTagSelectedRepository = Symbol('IPostTagSelectedRepository');