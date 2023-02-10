import { OnsiteRescueRequestModel } from '../../../../models';

export interface IOnsiteRescueRequestRepository {
  findAllByCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<OnsiteRescueRequestModel[]>;
  findOneByCondition(condition: any): Promise<OnsiteRescueRequestModel>;
  countByCondition(condition: any): Promise<number>;
  findById(id: string): Promise<OnsiteRescueRequestModel>;
  create(payload: any): Promise<OnsiteRescueRequestModel>;
  getCurrentOfCustomer(customerId: string): Promise<OnsiteRescueRequestModel>;
  update(
    id: string,
    payload: any,
  ): Promise<[number, OnsiteRescueRequestModel[]]>;
  delete(id: string): void;
}

export const IOnsiteRescueRequestRepository = Symbol(
  'IOnsiteRescueRequestRepository',
);
