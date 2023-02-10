import { OnsiteRescueResponseModel } from '../../../../models';

export interface IOnsiteRescueResponseRepository {
  findAllByCondition(
    limit: number,
    offset: number,
    condition: any,
  ): Promise<OnsiteRescueResponseModel[]>;
  findOneByCondition(condition: any): Promise<OnsiteRescueResponseModel>;
  countByCondition(condition: any): Promise<number>;
  findById(id: string): Promise<OnsiteRescueResponseModel>;
  create(payload: any): Promise<OnsiteRescueResponseModel>;
  update(
    id: string,
    payload: any,
  ): Promise<[number, OnsiteRescueResponseModel[]]>;
  delete(id: string): void;
  findAllByConditionWithoutPagination(condition: any): Promise<OnsiteRescueResponseModel[]>
}

export const IOnsiteRescueResponseRepository = Symbol(
  'IOnsiteRescueResponseRepository',
);
