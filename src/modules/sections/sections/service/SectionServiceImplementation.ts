import { forwardRef, Inject } from '@nestjs/common';
import { ProductModel, SectionModel } from '../../../../models';
import { IProductService } from '../../../products/service/products/ProductServiceInterface';
import { IServiceService } from '../../../services/service/ServiceServiceInterface';
import { SectionTypeEnum } from '../../enums/SectionEnum';
import { ISectionAgentRelationService } from '../../section-agent-relation/service/SectionAgentRelationServiceInterface';
import { ISectionDealRelationService } from '../../section-deal-relation/service/SectionDealRelationServiceInterface';
import { ISectionPostRelationService } from '../../section-post-relation/service/SectionPostRelationServiceInterface';
import { ISectionProductRelationService } from '../../section-product-relation/service/SectionProductRelationServiceInterface';
import { ISectionPromotionRelationService } from '../../section-promotion-relation/service/SectionPromotionRelationServiceInterface';
import {
  FilterSectionDto,
  UpdateSectionDto,
  UpdateSectionOrderDto,
} from '../dto/SectionDto';
import { ISectionRepository } from '../repository/SectionRepositoryInterface';
import { ISectionService } from './SectionServiceInterface';

export class SectionServiceImplementation implements ISectionService {
  constructor(
    @Inject(ISectionRepository) private sectionRepository: ISectionRepository,
    @Inject(forwardRef(() => ISectionAgentRelationService))
    private sectionAgentRelationService: ISectionAgentRelationService,
    @Inject(forwardRef(() => ISectionDealRelationService))
    private sectionDealRelationRepository: ISectionDealRelationService,
    @Inject(forwardRef(() => ISectionProductRelationService))
    private sectionProductRelationService: ISectionProductRelationService,
    @Inject(forwardRef(() => ISectionPromotionRelationService))
    private sectionPromotionRelationService: ISectionPromotionRelationService,
    @Inject(forwardRef(() => ISectionPostRelationService))
    private sectionPostRelationService: ISectionPostRelationService,
    @Inject(forwardRef(() => IProductService)) private productService: IProductService,
    @Inject(IServiceService) private serviceService: IServiceService,
  ) {}

  async getSectionDetail(
    id: string,
  ): Promise<SectionModel & { items: Array<any> }> {
    const section = await this.sectionRepository.findById(id);
    if (!section) {
      throw new Error('Section not found');
    }
    const data: SectionModel & { items: Array<any> } = {
      ...JSON.parse(JSON.stringify(section)),
      items: [],
    };
    switch (section.type) {
      case SectionTypeEnum.AUTHENTIC_AGENT:
        data.items = await this.sectionAgentRelationService.getAllByCondition({
          section_id: section.id,
        });
        break;
      case SectionTypeEnum.TOP_AGENT:
        data.items = await this.sectionAgentRelationService.getAllByCondition({
          section_id: section.id,
        });
        break;
      case SectionTypeEnum.BEST_SELLER_PRODUCT:
        const bestSellerProducts =
          await this.productService.getMostCompletedOrderProduct();
        data.items = await Promise.all(
          bestSellerProducts.map((product) => this.mappingProductData(product)),
        );
        break;
      case SectionTypeEnum.HOT_DEAL:
        data.items =
          await this.sectionDealRelationRepository.getListByCondition({
            section_id: section.id,
          });
        break;
      case SectionTypeEnum.MOST_VIEWED_PRODUCT:
        const mostViewedProducts =
          await this.productService.getMostViewCountProduct();
        data.items = await Promise.all(
          mostViewedProducts.map((product) => this.mappingProductData(product)),
        );
        break;
      case SectionTypeEnum.MOST_VIEWED_SERVICE:
        const services = await this.serviceService.getMostViewCountService();
        data.items = services.map((service) => service.transformToResponse());
        break;
      case SectionTypeEnum.PROMOTION:
        data.items =
          await this.sectionPromotionRelationService.getAllByCondition({
            section_id: section.id,
          });
        break;
      case SectionTypeEnum.INSURANCE_PRODUCT:
        const insuranceProducts =
          await this.sectionProductRelationService.getAllByCondition({
            section_id: section.id,
          });
        data.items = await Promise.all(
          insuranceProducts.map(async (item) => ({
            section_id: item.section_id,
            product_id: item.product_id,
            order: item.order,
            product: await this.mappingProductData(item.product)
          })),
        );
        break;
      case SectionTypeEnum.SPARE_PARTS_PRODUCT:
        const sparePartsProducts =
          await this.sectionProductRelationService.getAllByCondition({
            section_id: section.id,
          });
        data.items = await Promise.all(
          sparePartsProducts.map(async (item) => ({
            section_id: item.section_id,
            product_id: item.product_id,
            order: item.order,
            product: await this.mappingProductData(item.product)
          })),
        );
        break;
      case SectionTypeEnum.TIRE_WHEEL_PRODUCT:
        const tireWheelProducts =
          await this.sectionProductRelationService.getAllByCondition({
            section_id: section.id,
          });
        data.items = await Promise.all(
          tireWheelProducts.map(async (item) => ({
            section_id: item.section_id,
            product_id: item.product_id,
            order: item.order,
            product: await this.mappingProductData(item.product)
          })),
        );
        break;
      case SectionTypeEnum.BATTERY_PRODUCT:
        const batteryProducts =
          await this.sectionProductRelationService.getAllByCondition({
            section_id: section.id,
          });
        data.items = await Promise.all(
          batteryProducts.map(async (item) => ({
            section_id: item.section_id,
            product_id: item.product_id,
            order: item.order,
            product: await this.mappingProductData(item.product)
          })),
        );
        break;
      case SectionTypeEnum.TOP_PRODUCT:
        const topProducts =
          await this.sectionProductRelationService.getAllByCondition({
            section_id: section.id,
          });
        data.items = await Promise.all(
          topProducts.map(async (item) => ({
            section_id: item.section_id,
            product_id: item.product_id,
            order: item.order,
            product: await this.mappingProductData(item.product)
          })),
        );
        break;
      case SectionTypeEnum.TOP_POST:
        data.items = await this.sectionPostRelationService.getAllByCondition({
          section_id: section.id,
        });
        break;
    }
    return data;
  }
  getSectionListByCondition(
    condition: FilterSectionDto,
  ): Promise<SectionModel[]> {
    try {
      const { limit, page, ...rest } = condition;
      return this.sectionRepository.findAllByCondition(
        limit,
        (page - 1) * limit,
        rest,
      );
    } catch (error) {
      throw error;
    }
  }
  async updateSectionById(
    id: string,
    payload: UpdateSectionDto,
  ): Promise<SectionModel> {
    try {
      const section = await this.sectionRepository.findById(id);
      if (!section) {
        throw new Error('Section not found');
      }
      const [nModified, sections] = await this.sectionRepository.updateById(
        id,
        payload,
      );
      if (!nModified) {
        throw new Error('Cannot update section');
      }
      const updatedSection = sections[0];
      return updatedSection;
    } catch (error) {
      throw error;
    }
  }
  async updateSectionOrder(
    id: string,
    payload: UpdateSectionOrderDto,
  ): Promise<SectionModel> {
    try {
      const { new_order } = payload;
      const section = await this.sectionRepository.findById(id);
      if (!section) {
        throw new Error('Section not found');
      }
      const orderPlacedSection =
        await this.sectionRepository.findOneByCondition({
          order: new_order,
        });
      if (orderPlacedSection) {
        await orderPlacedSection.update({ order: section.order });
      }
      await section.update({ order: new_order });
      return section;
    } catch (error) {
      throw error;
    }
  }
  countByCondition(condition: any): Promise<number> {
    const { limit, page, ...rest } = condition;
    return this.sectionRepository.countByCondition(rest);
  }

  private async mappingProductData(product: ProductModel) {
    const productTotalSold = await Promise.all(
      product.variants.map((variant) =>
        this.productService.getProductTotalSoldBySku(variant.sku),
      ),
    );
    const data = product.transformToResponse({
      total_sold: productTotalSold.reduce((a, b) => a + b, 0),
    });
    return data;
  }

  getSectionDetailByCondition(condition: any): Promise<SectionModel> {
    return this.sectionRepository.findOneByCondition(condition);
  }
}
