import { v4 as uuidv4 } from 'uuid';
import {
  CreateCustomerDto,
  FilterCustomerDto,
  UpdateCustomerDto,
} from '../../dto/CustomerDto';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ICustomerRepository } from '../../repository/customer/CustomerRepositoryInterface';
import { ICustomerService } from './CustomerServiceInterface';
import { CustomerModel } from '../../../../models';
import { Op } from 'sequelize';
import { ICustomerAgentRelationRepository } from '../../repository/customer-agent-relations/CustomerAgentRelationRepositoryInterface';
import { IAgentService } from '../../../agents/service/AgentServiceInterface';
import { IForbiddenKeywordService } from '../../../forbidden-keywords/service/ForbiddenKeywordServiceInterface';
import { removeVietnameseTones } from '../../../../helpers/stringHelper';

@Injectable()
export class CustomerServiceImplementation implements ICustomerService {
  constructor(
    @Inject(ICustomerRepository)
    private customerRepository: ICustomerRepository,
    @Inject(ICustomerAgentRelationRepository)
    private customerAgentRelationRepository: ICustomerAgentRelationRepository,
    @Inject(forwardRef(() => IAgentService))
    private agentService: IAgentService,
    @Inject(forwardRef(() => IForbiddenKeywordService))
    private forbiddenKeywordService: IForbiddenKeywordService,
  ) {}

  async createCustomer(
    payload: CreateCustomerDto,
    schema: string,
  ): Promise<CustomerModel> {
    try {
      const checkForbiddenKeyword =
        await this.forbiddenKeywordService.checkKeywordsExist([
          payload.full_name,
        ]);
      if (checkForbiddenKeyword) {
        let data = {
          message: 'Forbidden keywords exists',
          value: checkForbiddenKeyword,
          code: 'FORBIDDEN_KEYWORD_ERROR',
        };
        throw data;
      }
      if (payload.full_name) {
        payload.converted_full_name = removeVietnameseTones(payload.full_name)
          .split(' ')
          .filter((item) => item !== '')
          .join(' ');
      }
      const createdCustomer = await this.customerRepository.create(
        { ...payload, id: uuidv4() },
        schema,
      );
      return createdCustomer;
    } catch (error) {
      throw error;
    }
  }

  async getCustomerList(
    payload: FilterCustomerDto,
    schema: string,
  ): Promise<CustomerModel[]> {
    const { limit, page, agent_id, ...rest } = payload;
    const condition = this.buildSearchQueryCondition(rest);
    if (agent_id) {
      const agent = await this.agentService.getAgentDetails(agent_id);
      if (!agent) {
        throw new Error('Agent not found');
      }
      const customerAgents =
        await this.customerAgentRelationRepository.findAllByConditionWithPagination(
          limit,
          (page - 1) * limit,
          {
            agent_id: agent.id,
            customerCondition: condition,
          },
        );
      return customerAgents.map((customerAgent) => customerAgent.customer);
    } else {
      const customers = await this.customerRepository.findAllByCondition(
        limit,
        (page - 1) * limit,
        condition,
        schema,
      );
      return customers;
    }
  }

  getCustomerDetailByCondition(
    condition: any,
    schema: string,
  ): Promise<CustomerModel> {
    return this.customerRepository.findOneByCondition(condition);
  }

  getCustomerDetail(id: string, schema: string): Promise<CustomerModel> {
    return this.customerRepository.findById(id);
  }

  countCustomerByCondition(condition: any, schema: string): Promise<number> {
    if (condition.agent_id) {
      return this.customerAgentRelationRepository.countByCondition({
        agent_id: condition.agent_id,
      });
    }
    const queryCondition = this.buildSearchQueryCondition(condition);
    return this.customerRepository.countByCondition(queryCondition, schema);
  }

  async updateCustomer(
    id: string,
    payload: UpdateCustomerDto,
  ): Promise<CustomerModel> {
    try {
      const checkForbiddenKeyword =
        await this.forbiddenKeywordService.checkKeywordExist(payload.full_name);
      if (checkForbiddenKeyword) {
        let data = {
          message: 'Forbidden keywords exists',
          value: checkForbiddenKeyword,
          code: 'FORBIDDEN_KEYWORD_ERROR',
        };
        throw data;
      }
      const params: Record<string, any> = {
        ...payload,
      };
      if (payload.full_name) {
        params.converted_name = removeVietnameseTones(payload.full_name)
          .split(' ')
          .filter((item) => item !== '')
          .join(' ');
      }
      const [nModified, customers] = await this.customerRepository.update(
        id,
        params,
      );
      if (!nModified) {
        throw new Error('Cannot update customer');
      }
      return customers[0];
    } catch (error) {
      throw error;
    }
  }

  async deleteCustomer(id: string): Promise<boolean> {
    try {
      const customer = await this.getCustomerDetail(id, 'public');
      if (!customer) {
        throw new Error('Customer not found');
      }
      const deletedCustomer = await this.customerRepository.delete(customer.id);
      const user = customer.user_details;
      user.is_deleted = true;
      await user.save();
      return !!deletedCustomer;
    } catch (error) {
      throw error;
    }
  }

  async addCustomerAgent(
    customerId: string,
    agentId: string,
  ): Promise<CustomerModel> {
    try {
      const params: Record<string, any> = {
        customer_id: customerId,
        agent_id: agentId,
      };
      const customer = await this.getCustomerDetail(customerId, 'public');
      const agent = await this.agentService.getAgentDetails(agentId);
      if (!customer || !agent) {
        throw new Error('Customer Or Agent not found');
      }
      const nCustomerAgent =
        await this.customerAgentRelationRepository.countByCondition(params);
      if (nCustomerAgent < 1) {
        const createdAgentCustomer =
          await this.customerAgentRelationRepository.create(params);
        return this.getCustomerDetail(
          createdAgentCustomer.customer_id,
          'public',
        );
      } else {
        console.log('Customer already added to agent customer list');
      }
    } catch (error) {
      throw error;
    }
  }

  buildSearchQueryCondition(condition: Record<string, any>) {
    let queryCondition = {
      ...condition,
    };
    const removeKeys = ['limit', 'page', 'agent_id'];

    for (const key of Object.keys(queryCondition)) {
      for (const value of removeKeys) {
        if (key === value) {
          delete queryCondition[key];
        }
      }
    }

    if (condition.full_name && condition.full_name.startsWith('0')) {
      queryCondition = {
        ...queryCondition,
        phone_number: {
          [Op.iLike]: `%${condition.full_name}%`,
        },
      };
      delete queryCondition.full_name;
    } else if (condition.phone_number) {
      queryCondition = {
        ...queryCondition,
        phone_number: {
          [Op.iLike]: `%${condition.phone_number}%`,
        },
      };
    } else if (condition.email) {
      queryCondition = {
        ...queryCondition,
        email: {
          [Op.iLike]: `%${condition.email}%`,
        },
      };
    }
    console.log(queryCondition);
    return queryCondition;
  }

  getCustomerListByConditionWithoutPagination(
    condition: any,
  ): Promise<CustomerModel[]> {
    return this.customerRepository.findAllByConditionWithoutPagination(
      condition,
    );
  }
}
