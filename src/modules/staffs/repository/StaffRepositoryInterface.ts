import { StaffModel } from '../../../models';
import {
  CreateStaffEntityDto,
  StaffEntityDto,
  UpdateStaffEntityDto,
} from '../dto/StaffDto';

export interface IStaffRepository {
  findAllByCondition(
     limit: number,
     offset: number,
     condition: any
   ): Promise<StaffModel[]>;
  findOneById(id: string): Promise<StaffModel>;
  create(
    payload: any,
    transaction?: any,
  ): Promise<StaffModel>;
  update(
    id: string,
    payload: UpdateStaffEntityDto,
  ): Promise<[number, StaffModel[]]>;
  delete(id: string): void;
  count(condition: any): Promise<number>;
}

export const IStaffRepository = Symbol('IStaffRepository');
