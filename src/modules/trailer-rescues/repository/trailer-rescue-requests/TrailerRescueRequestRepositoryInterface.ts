import { TrailerRescueRequestModel } from '../../../../models';

export interface ITrailerRescueRequestRepository {
  findAllByCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<TrailerRescueRequestModel[]>;
  findOneByCondition(condition: any): Promise<TrailerRescueRequestModel>;
  countByCondition(condition: any): Promise<number>;
  findById(id: string): Promise<TrailerRescueRequestModel>;
  create(payload: any): Promise<TrailerRescueRequestModel>;
  getCurrentOfCustomer(customerId: string): Promise<TrailerRescueRequestModel>;
  update(
    id: string,
    payload: any,
  ): Promise<[number, TrailerRescueRequestModel[]]>;
  delete(id: string): void;
}

export const ITrailerRescueRequestRepository = Symbol(
  'ITrailerRescueRequestRepository',
);
