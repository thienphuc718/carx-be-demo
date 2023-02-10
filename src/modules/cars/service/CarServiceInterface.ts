import { CarModel } from '../../../models/Cars';
import { CreateCarPayloadDto, FilterCarDto, UpdateCarPayloadDto } from "../dto/CarDto";

export interface ICarService {
    getCarList(payload: FilterCarDto): Promise<CarModel[]>
    getCarDetail(id: string): Promise<CarModel>
    createCar(payload: CreateCarPayloadDto): Promise<CarModel>
    updateCar(id: string, payload: UpdateCarPayloadDto): Promise<number>
    deleteCar(id: string): Promise<void>
}

export const ICarService = Symbol('ICarService');
