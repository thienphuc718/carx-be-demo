import { TrailerFormerRescueResponseModel } from '../../../../models';

export interface ITrailerFormerRescueResponseRepository {
  findAllByCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<TrailerFormerRescueResponseModel[]>;
  findOneByCondition(condition: any): Promise<TrailerFormerRescueResponseModel>;
  countByCondition(condition: any): Promise<number>;
  findById(id: string): Promise<TrailerFormerRescueResponseModel>;
  create(payload: any): Promise<TrailerFormerRescueResponseModel>;
  update(
    id: string,
    payload: any,
  ): Promise<[number, TrailerFormerRescueResponseModel[]]>;
  delete(id: string): void;
  findAllByConditionWithoutPagination(condition: any): Promise<TrailerFormerRescueResponseModel[]>
}

export const ITrailerFormerRescueResponseRepository = Symbol(
  'ITrailerFormerRescueResponseRepository',
);
