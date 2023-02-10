import { Inject } from '@nestjs/common';
import { Op } from 'sequelize';
import { SliderModel } from '../../../models';
import {
  CreateSliderPayloadDto,
  FilterSliderDto,
  UpdateSliderOrderPayloadDto,
  UpdateSliderPayloadDto,
} from '../dto/SliderDto';
import { ISliderRepository } from '../repository/SliderRepositoryInterface';
import { ISliderService } from './SliderServiceInterface';

export class SliderServiceImplementation implements ISliderService {
  constructor(
    @Inject(ISliderRepository) private sliderRepository: ISliderRepository,
  ) {}
  getSliderList(payload: FilterSliderDto): Promise<SliderModel[]> {
    const { limit, page, ...rest } = payload;
    return this.sliderRepository.findAllByCondition(
      limit,
      (page - 1) * limit,
      rest,
    );
  }
  getSliderDetail(id: string): Promise<SliderModel> {
    return this.sliderRepository.findById(id);
  }
  async createSlider(payload: CreateSliderPayloadDto): Promise<SliderModel> {
    try {
      const sliderList = await this.getSliderListWithoutPagination({});
      if (sliderList.length === 15) {
        throw new Error('Maximum amount of sliders is exceeded');
      }
      const createdSlider = await this.sliderRepository.create(payload);
      return createdSlider;
    } catch (error) {
      throw error;
    }
  }
  async updateSlider(
    id: string,
    payload: UpdateSliderPayloadDto,
  ): Promise<SliderModel> {
    try {
      const [nModified, sliders] = await this.sliderRepository.update(
        id,
        payload,
      );
      if (!nModified) {
        throw new Error(`Cannot update slider`);
      }
      const updatedSlider = sliders[0];
      return updatedSlider;
    } catch (error) {
      throw error;
    }
  }
  countSliderByCondition(condition: any): Promise<number> {
    const { limit, page, ...rest } = condition;
    return this.sliderRepository.count(rest);
  }
  async deleteSlider(id: string): Promise<boolean> {
    try {
      const slider = await this.getSliderDetail(id);
      if (!slider) {
        throw new Error('Slider not found');
      }
      const sliderOrder: number = slider.order;
      const nDeleted = await this.sliderRepository.delete(id);
      if (!nDeleted) {
        return false;
      } else if (sliderOrder === 15) {
        return true;
      } else {
        const sliders = await this.getSliderListWithoutPagination({
          order: {
            [Op.gt]: sliderOrder,
          },
        });
        await Promise.all(
          sliders.map((slider) => {
            slider.order -= 1;
            slider.save();
          }),
        );
        return true;
      }
    } catch (error) {
      throw error;
    }
  }
  async updateSliderOrder(
    id: string,
    payload: UpdateSliderOrderPayloadDto,
  ): Promise<SliderModel> {
    try {
      const { new_order } = payload;
      const verifiedSlider = await this.getSliderDetail(id);
      if (!verifiedSlider) {
        throw new Error('Slider not found');
      }
      const orderPlacedSlider = await this.sliderRepository.findOneByCondition({
        order: new_order,
      });
      if (orderPlacedSlider) {
        await orderPlacedSlider.update({ order: verifiedSlider.order });
      }
      const [nModified, sliders] = await this.sliderRepository.update(
        verifiedSlider.id,
        { order: new_order },
      );
      if (!nModified) {
        throw new Error(`Cannot update slider's order`);
      }
      const updatedSlider = sliders[0];
      return updatedSlider;
    } catch (error) {
      throw error;
    }
  }
  getSliderListWithoutPagination(condition: any) {
    return this.sliderRepository.findAllByConditionWithoutPagination(condition);
  }
}
