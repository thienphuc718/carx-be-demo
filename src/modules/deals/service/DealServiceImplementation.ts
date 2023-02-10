import {forwardRef, Inject} from '@nestjs/common';
import { Op } from 'sequelize';
import { DealModel } from '../../../models';
import { IProductService } from '../../products/service/products/ProductServiceInterface';
import { CreateDealDto, FilterDealDto, UpdateDealDto } from '../dto/DealDto';
import { IDealRepository } from '../repository/DealRepositoryInterface';
import { IDealService } from './DealServiceInterface';
import {removeVietnameseTones} from "../../../helpers/stringHelper";
import {
  ISectionDealRelationService
} from "../../sections/section-deal-relation/service/SectionDealRelationServiceInterface";
export class DealServiceImplementation implements IDealService {
  constructor(
    @Inject(IDealRepository) private dealRepository: IDealRepository,
    @Inject(forwardRef(() => IProductService)) private productService: IProductService,
    @Inject(forwardRef(() => ISectionDealRelationService)) private sectionDealService: ISectionDealRelationService,
  ) {}

  async getDealListByCondition(payload: FilterDealDto): Promise<DealModel[]> {
    try {
      const { limit, page, ...rest } = payload;
      const queryCondition = this.buildSearchQueryCondition(rest);
      const deals = await this.dealRepository.findAllByCondition(
        limit,
        (page - 1) * limit,
        queryCondition,
      );
      return deals;
    } catch (error) {
      throw error;
    }
  }

  async createDeal(payload: CreateDealDto): Promise<DealModel> {
    const product = await this.productService.getProductDetail(
      payload.product_id,
    );
    if (!product) {
      throw new Error('Product not found');
    }
    const params: Record<string, any> = {
      ...payload,
    }
    if (payload.title) {
      params.converted_title = removeVietnameseTones(payload.title).split(' ').filter(item => item !== "").join(' ');
    }
    const createdDeal = await this.dealRepository.create(params);
    return this.getDealDetail(createdDeal.id);
  }

  async updateDeal(id: string, payload: UpdateDealDto): Promise<DealModel> {
    const params: Record<string, any> = {
      ...payload,
    }
    if (payload.title) {
      params.converted_title = removeVietnameseTones(payload.title).split(' ').filter(item => item !== "").join(' ');
    }
    const [nModified, deals] = await this.dealRepository.update(id, params);
    if (!nModified) {
      throw new Error('Cannot update deal detail');
    }
    return deals[0];
  }
  countDealByCondition(condition: any): Promise<number> {
    const queryCondition = this.buildSearchQueryCondition(condition);
    return this.dealRepository.countByCondition(queryCondition);
  }

  getDealDetail(id: string): Promise<DealModel> {
    return this.dealRepository.findById(id);
  }
  getDealByCondition(condition: any): Promise<DealModel> {
    return this.dealRepository.findOneByCondition(condition);
  }
  async deleteDeal(id: string): Promise<void> {
    try {
      const deal = await this.getDealDetail(id);
      if (!deal) {
        throw new Error('Deal not found');
      }
      this.dealRepository.delete(id);
      const sectionDeal = await this.sectionDealService.getDetailByCondition({
        deal_id: deal.id,
      });
      if (sectionDeal) {
        await this.sectionDealService.deleteByCondition({
          deal_id: deal.id,
        })
      }
    } catch (error) {
      throw error;
    }
  }

  buildSearchQueryCondition(condition: Record<string, any>) {
    let queryCondition = {
      ...condition,
    };
    const removeKeys = ['limit', 'page'];
    for (const key of Object.keys(queryCondition)) {
      for (const value of removeKeys) {
        if (key === value) {
          delete queryCondition[key];
        }
      }
    }
    return queryCondition;
  }
}
