import { SliderModel } from '../../../models';
import { CreateSliderPayloadDto, FilterSliderDto, UpdateSliderOrderPayloadDto, UpdateSliderPayloadDto } from '../dto/SliderDto';

export interface ISliderService {
  getSliderList(payload: FilterSliderDto): Promise<SliderModel[]>;
  getSliderDetail(id: string): Promise<SliderModel>;
  createSlider(payload: CreateSliderPayloadDto): Promise<SliderModel>;
  updateSlider(id: string, payload: UpdateSliderPayloadDto): Promise<SliderModel>;
  updateSliderOrder(id: string, payload: UpdateSliderOrderPayloadDto): Promise<SliderModel>
  countSliderByCondition(condition: any): Promise<number>;
  deleteSlider(id: string): Promise<boolean>;
}

export const ISliderService = Symbol('ISliderService');
