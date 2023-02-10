import { TrailerLaterRescueResponseModel } from '../../../../models';

export interface ITrailerLaterRescueResponseRepository {
  findAllByCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<TrailerLaterRescueResponseModel[]>;
  findOneByCondition(condition: any): Promise<TrailerLaterRescueResponseModel>;
  countByCondition(condition: any): Promise<number>;
  findById(id: string): Promise<TrailerLaterRescueResponseModel>;
  create(payload: any): Promise<TrailerLaterRescueResponseModel>;
  update(
    id: string,
    payload: any,
  ): Promise<[number, TrailerLaterRescueResponseModel[]]>;
  delete(id: string): void;
  findAllByConditionWithoutPagination(condition: any): Promise<TrailerLaterRescueResponseModel[]>
}

export const ITrailerLaterRescueResponseRepository = Symbol(
  'ITrailerLaterRescueResponseRepository',
);
