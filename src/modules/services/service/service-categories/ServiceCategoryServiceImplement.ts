import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ServiceCategoryModel } from '../../../../models/ServiceCategories';

import {
  FilterServiceCategoryDto,
  CreateServiceCategoryDto,
  UpdateServiceCategoryDto,
} from '../../dto/ServiceCategoryDto';
import { IServiceCategoryRepository } from '../../repository/service-categories/ServiceCategoryRepositoryInterface';
import { IServiceCategoryService } from './ServiceCategoryServiceInterface';
import { v4 as uuidv4 } from 'uuid';
import { generateSlug } from '../../../../helpers/stringHelper';
import { IAgentService } from '../../../agents/service/AgentServiceInterface';
import { IServiceService } from '../ServiceServiceInterface';
import { IServiceCategoryRelationService } from '../service-category-relations/ServiceCategoryRelationServiceInterface';

@Injectable()
export class ServiceCategoryServiceImplementation implements IServiceCategoryService {
  constructor(
    @Inject(IServiceCategoryRepository)
    private serviceCategoryRepository: IServiceCategoryRepository,
    @Inject(forwardRef(() => IAgentService)) private agentService: IAgentService,
    @Inject(forwardRef(() => IServiceService)) private serviceService: IServiceService,
    @Inject(IServiceCategoryRelationService)
    private serviceCategoryRelationService: IServiceCategoryRelationService
  ) {}

  async getServiceCategoryList(payload: FilterServiceCategoryDto): Promise<ServiceCategoryModel[]> {
    try {
      const { limit, page, agent_id,...rest } = payload;
      let serviceCategories = null;
      if (agent_id) {
        const categoryIds = await this.getServiceCategoryIdsByAgentId(agent_id);
        serviceCategories = await this.serviceCategoryRepository.findAllByCondition(
          limit,
          (page - 1) * limit,
          {
            ...rest,
            id: categoryIds,
          },
        );
      } else {
        serviceCategories = await this.serviceCategoryRepository.findAllByCondition(
          limit,
          (page - 1) * limit,
          rest,
        );
      }
      return serviceCategories;
    } catch (error) {
      throw error
    }
  }

  async getServiceCategoryIdsByAgentId(agentId: string): Promise<string[]> {
    const agent = await this.agentService.getAgentDetails(agentId);
    if (!agent) {
    throw new Error('Agent not found');
    } 
    const agentServices = await this.serviceService.getServiceListByConditionWithoutPagination({
      agent_id: agentId,
    });
    const serviceIds = agentServices.map(service => service.id);
    const relations = await this.serviceCategoryRelationService.getServiceCategoryRelationListByConditionWithoutPagination({
      service_id: serviceIds
    });
    const categoryIds = relations.map(relation => relation.category_id);
    const uniqueCategoryIds = [...new Set(categoryIds)];
    return uniqueCategoryIds;
  }

  async getAllServiceCategory(): Promise<ServiceCategoryModel[]> {
    try {
      return this.serviceCategoryRepository.findAll();
    } catch (error) {
      throw error;
    }
  }

  getServiceCategoryDetail(id: string): Promise<ServiceCategoryModel> {
    try {
      return this.serviceCategoryRepository.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async createServiceCategory(payload: CreateServiceCategoryDto): Promise<ServiceCategoryModel> {
    try {
      const createdServiceCategory = await this.serviceCategoryRepository.create({
        ...payload,
        slug: generateSlug(payload.name),
      });
      return createdServiceCategory;
    } catch (error) {
      throw error;
    }
  }

  async updateServiceCategory(
    id: string,
    payload: UpdateServiceCategoryDto,
  ): Promise<ServiceCategoryModel> {
    try {
      const updatedServiceCategory = await this.serviceCategoryRepository.update(id, payload);
      return updatedServiceCategory;
    } catch (error) {
      throw error;
    }
  }

  async deleteServiceCategory(id: string): Promise<void> {
    try {
      const serviceCategory = await this.getServiceCategoryDetail(id);
      if (!serviceCategory) {
        throw new Error('ServiceCategory not found');
      }
      this.serviceCategoryRepository.delete(id);
    } catch (error) {
      throw error
    }
  }

  async countServiceCategoryByCondition(condition: any): Promise<number> {
      const { agent_id, ...rest } = condition;
      const queryCondition = this.buildSearchQueryCondition(rest);
      if (agent_id) {
        const categoryIds = await this.getServiceCategoryIdsByAgentId(agent_id);
        queryCondition.id = categoryIds;
      }
      return this.serviceCategoryRepository.count(queryCondition);
  }

  getServiceCategoryByCondition(condition: any): Promise<ServiceCategoryModel> {
    return this.serviceCategoryRepository.findOneByCondition(condition);
  }

  buildSearchQueryCondition(condition: Record<string, any>) {
    let queryCondition = {
      ...condition,
    }

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
