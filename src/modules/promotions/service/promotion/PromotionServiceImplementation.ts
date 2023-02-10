import { forwardRef, Inject } from '@nestjs/common';
import { PromotionModel } from '../../../../models';
import {
  FilterPromotionDto,
  PromotionPayloadDto,
  UpdatePromotionPayloadDto,
} from '../../dto/PromotionDto';

import {
  PromotionDiscountTypeEnum,
  PromotionProviderEnum,
  PromotionStatusEnum,
  PromotionTypeEnum,
} from '../../enum/PromotionEnum';

import {
  add,
  differenceInHours,
  differenceInMilliseconds,
  endOfDay,
  startOfDay,
} from 'date-fns';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { IAgentService } from '../../../agents/service/AgentServiceInterface';
import { IPromotionRepository } from '../../repository/promotion/PromotionRepositoryInterface';
import { IPromotionService } from './PromotionServiceInterface';
import { generateRandomCode } from '../../helper/PromotionCodeHelper';
import {
  ISectionPromotionRelationService
} from "../../../sections/section-promotion-relation/service/SectionPromotionRelationServiceInterface";
import {removeVietnameseTones} from "../../../../helpers/stringHelper";
import {utcToZonedTime, zonedTimeToUtc} from "date-fns-tz";


export class PromotionServiceImplementation implements IPromotionService {
  constructor(
    @Inject(IPromotionRepository)
    private readonly promotionRepository: IPromotionRepository,
    @Inject(forwardRef(() => IAgentService))
    private agentService: IAgentService,
    @Inject(forwardRef(() => ISectionPromotionRelationService))
    private sectionPromotionService: ISectionPromotionRelationService,
  ) {}

  async getPromotionList(
    payload: FilterPromotionDto,
  ): Promise<[total: number, promotions: PromotionModel[]]> {
    try {
      const { limit, page, ...rest } = payload;
      const condition = this.buildSearchQueryCondition(rest);
      const promotions = await this.promotionRepository.findAllByCondition(
        limit,
        (page - 1) * limit,
        condition,
      );
      const totalPromotion = await this.countPromotionByCondition(condition);
      return [totalPromotion, promotions];
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  getPromotionByCondition(condition: any): Promise<PromotionModel> {
    try {
      return this.promotionRepository.findOneByCondition(condition);
    } catch (error) {
      throw error;
    }
  }
  countPromotionByCondition(condition: any): Promise<number> {
    try {
      const queryCondition = this.buildSearchQueryCondition(condition);
      return this.promotionRepository.countByCondition(queryCondition);
    } catch (error) {
      throw error;
    }
  }
  getPromotionDetail(id: string): Promise<PromotionModel> {
    try {
      return this.promotionRepository.findById(id);
    } catch (error) {
      throw error;
    }
  }
  async createPromotion(payload: PromotionPayloadDto): Promise<PromotionModel> {
    try {
      if (payload.agent_id) {
        const agent = await this.agentService.getAgentDetails(payload.agent_id);
        if (!agent) {
          throw new Error('Agent not found or agent_id not provided');
        }
      }
      const startDate = zonedTimeToUtc(startOfDay(new Date(payload.start_date)), 'Asia/Ho_Chi_Minh');
      let endDate = null;
      if (payload.end_date) {
        endDate = zonedTimeToUtc(endOfDay(new Date(payload.end_date)), 'Asia/Ho_Chi_Minh');
      } else {
        const _endDateZone = utcToZonedTime(new Date(), 'Asia/Ho_Chi_Minh')
        const _endDateUtc = zonedTimeToUtc(endOfDay(_endDateZone), 'Asia/Ho_Chi_Minh')
        endDate = add(_endDateUtc, {years: 100})
      }
      this.validatePromotionDate(startDate, endDate);
      const newPromotionCode = generateRandomCode();
      if (
        payload.discount_type === PromotionDiscountTypeEnum.BY_PERCENTAGE &&
        payload.value > 100
      ) {
        throw new Error('Promotion value cannot be more than 100');
      }
      const params: Record<string, any> = {
        id: uuidv4(),
        ...payload,
        type: PromotionTypeEnum.DISCOUNT_VOUCHER,
        discount_type: PromotionDiscountTypeEnum[payload.discount_type],
        code: newPromotionCode,
        status: this.isPromotionStartToday(startDate)
          ? PromotionStatusEnum.ACTIVATING
          : PromotionStatusEnum.CREATED,
        provider: payload.agent_id
          ? PromotionProviderEnum.AGENT
          : PromotionProviderEnum.CARX,
        start_date: startDate,
        end_date: endDate,
      };
      if (payload.name) {
        params.converted_name = removeVietnameseTones(payload.name).split(' ').filter(item => item !== "").join(' ');
      }
      const createdPromotion = await this.promotionRepository.create(params);
      return createdPromotion;
    } catch (error) {
      throw error;
    }
  }
  async updatePromotion(
    id: string,
    payload: UpdatePromotionPayloadDto,
  ): Promise<number> {
    try {
      let startDate = null;
      let endDate = null;
      const promotion = await this.getPromotionDetail(id);
      // if (
      //   promotion.status === PromotionStatusEnum.ACTIVATING &&
      //   payload.start_date
      // ) {
      //   throw new Error('Cannot update start_date of ACTIVATING promotion');
      // } else if (
      //   promotion.status === PromotionStatusEnum.EXPIRED &&
      //   (payload.end_date || payload.start_date)
      // ) {
      //   throw new Error(
      //     'Cannot update start_date and end_date of EXPIRED promotion',
      //   );
      // } else {
      //   if (payload.start_date) {
      //     startDate = startOfDay(new Date(payload.start_date));
      //   } else {
      //     startDate = promotion.start_date;
      //   }
      //   if (payload.end_date) {
      //     endDate = endOfDay(new Date(payload.end_date));
      //   } else {
      //     endDate = promotion.end_date;
      //   }
      //   this.validatePromotionDate(startDate, endDate);
      //   // TODO: can only update promotion start_date and end_date when status === CREATED
      // }
      if (
        promotion.status !== PromotionStatusEnum.CREATED &&
        (payload.start_date || payload.end_date)
      ) {
        throw new Error(
          'Cannot update start_date and end_date of promotion with status not CREATED',
        );
      } else {
        if (payload.start_date) {
          startDate = startOfDay(new Date(payload.start_date));
        } else {
          startDate = promotion.start_date;
        } 
        if (payload.end_date) {
          endDate = endOfDay(new Date(payload.end_date));
        } else {
          endDate = promotion.end_date;
        }
        this.validatePromotionDate(startDate, endDate);
      }
      const params: Record<string, any> = {
        ...payload,
        status: this.isPromotionStartToday(startDate)
          ? PromotionStatusEnum.ACTIVATING
          : PromotionStatusEnum.CREATED,
        start_date: startDate,
        end_date: endDate,
        discount_type: PromotionDiscountTypeEnum[payload.discount_type],
      }
      if (payload.name) {
        params.converted_name =removeVietnameseTones(payload.name).split(' ').filter(item => item !== "").join(' ');
      }
      const updatedPromotion = await this.promotionRepository.update(
        promotion.id,
        params,
      );
      return updatedPromotion[0];
    } catch (error) {
      throw error;
    }
  }
  async deletePromotion(id: string): Promise<void> {
    try {
      const promotion = await this.getPromotionDetail(id);
      if (!promotion) {
        throw new Error('Promotion not found');
      }
      this.promotionRepository.delete(id);
      const sectionPromotion = await this.sectionPromotionService.getDetailByCondition({
        promotion_id: promotion.id,
      });
      if (sectionPromotion) {
        await this.sectionPromotionService.deleteByCondition({
          promotion_id: promotion.id,
        })
      }
    } catch (error) {
      throw error;
    }
  }

  async deleteMultiPromotions(ids: string[]): Promise<void> {
    try {
      if (ids.length <= 0) {
        throw new Error('Missing required attributes');
      }
      await Promise.all(ids.map((id) => this.deletePromotion(id)));
    } catch (error) {
      throw error;
    }
  }

  getPromotionListByConditionWithoutPagination(
    condition: any,
  ): Promise<PromotionModel[]> {
    try {
      return this.promotionRepository.findAllByConditionWithoutPagination(
        condition,
      );
    } catch (error) {
      throw error;
    }
  }

  buildSearchQueryCondition(condition: Record<string, any>) {
    let queryCondition: Record<string, any> = {
      ...condition,
      is_deleted: false,
    };
    const removeKeys = ['limit', 'page', 'start_date', 'end_date'];
    for (const key of Object.keys(queryCondition)) {
      for (const value of removeKeys) {
        if (key === value) {
          delete queryCondition[key];
        }
      }
    }
    if (condition.code) {
      queryCondition = {
        ...queryCondition,
        code: {
          [Op.iLike]: `%${condition.code}%`,
        },
      };
    }
    if (condition.start_date && condition.end_date) {
      const startDate = new Date(condition.start_date);
      const endDate = new Date(condition.end_date);
      queryCondition = {
        ...queryCondition,
        start_date: {
          [Op.gte]: startDate,
        },
        end_date: {
          [Op.lte]: endDate,
        },
      };
    }
    if (condition.agent_id) {
      queryCondition = {
        ...queryCondition,
        agent_id: {
          [Op.or]: [condition.agent_id, null],
        },
        provider: [PromotionProviderEnum.AGENT, PromotionProviderEnum.CARX]
      }
    }
    return queryCondition;
  }

  private validatePromotionDate(startDate: Date, endDate: Date): void {
    const todayZoned = utcToZonedTime(new Date(), 'Asia/Ho_Chi_Minh');
    const start = zonedTimeToUtc(startOfDay(todayZoned), 'Asia/Ho_Chi_Minh');
    const diffInHoursWithStartDateAndTodayStartDate = differenceInHours(
      startDate,
      start,
    );
    const diffInMillisecondsWithStartDateAndEndDate = differenceInMilliseconds(
      endDate,
      startDate,
    );
    if (diffInHoursWithStartDateAndTodayStartDate < 0) {
      throw new Error(
        'Cannot create or update promotion with start_date in the past',
      );
    }
    if (diffInMillisecondsWithStartDateAndEndDate < 0) {
      throw new Error('end_date cannot before start_date');
    }
  }

  // Nhan timezone
  // Start Date la UTC
  private isPromotionStartToday(startDate: Date): boolean {
    const todayZoned = utcToZonedTime(new Date(), 'Asia/Ho_Chi_Minh');
    const start = zonedTimeToUtc(startOfDay(todayZoned), 'Asia/Ho_Chi_Minh');
    const diffInHoursWithStartDateAndTodayStartDate = differenceInHours(
      startDate,
      start,
    );
    return (
      diffInHoursWithStartDateAndTodayStartDate >= 0 &&
      diffInHoursWithStartDateAndTodayStartDate < 24
    );
  }
}
