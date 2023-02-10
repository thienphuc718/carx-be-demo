import { CityModel } from '../../../../models/Cities';
import { CreateCityDto, FilterCityDto, UpdateCityDto } from '../../dto/CityDto';

export interface ICityService {
  getCityList(payload: FilterCityDto, schema: string): Promise<CityModel[]>;
  countCityByCondition(condition: any, schema: string): Promise<number>;
  getCityDetail(id: string, schema: string): Promise<CityModel>;
  createCity(payload: CreateCityDto, schema: string): Promise<CityModel>;
  updateCity(
    id: string,
    payload: UpdateCityDto,
    schema: string,
  ): Promise<number>;
  deleteCity(id: string, schema: string): Promise<void>;
}

export const ICityService = Symbol('ICityService');
