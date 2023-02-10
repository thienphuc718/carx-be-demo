import { GiftModel } from "../../../../models";


export interface IGiftRepository {
  findAll(): Promise<GiftModel[]>;
  findAllByCondition(limit: number, offset: number, condition: any): Promise<GiftModel[]>;
  findOneByCondition(condition: any): Promise<GiftModel>;
  countByCondition(condition: any): Promise<number>;
  findById(id: string): Promise<GiftModel>;
  create(payload: any): Promise<GiftModel>;
  update(id: string, payload: any): Promise<any>;
  delete(id: string): void;
}

export const IGiftRepository = Symbol('IGiftRepository');
