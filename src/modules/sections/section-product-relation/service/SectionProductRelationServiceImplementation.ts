import {forwardRef, Inject} from '@nestjs/common';
import {SectionProductRelationModel} from '../../../../models';
import {ProductStatusEnum, ProductTypeEnum} from '../../../products/enum/ProductEnum';
import {IProductService} from '../../../products/service/products/ProductServiceInterface';
import {SectionTypeEnum} from '../../enums/SectionEnum';
import {ISectionService} from '../../sections/service/SectionServiceInterface';
import {
  CreateSectionProductRelationPayloadDto,
  UpdateSectionProductRelationPayloadDto,
} from '../dto/SectionProductRelationDto';
import {ISectionProductRepository} from '../repository/SectionProductRelationRepositoryInterface';
import {SectionProductRelationQueryConditionType} from '../type/SectionProductRelationType';
import {ISectionProductRelationService} from './SectionProductRelationServiceInterface';

export class SectionProductServiceImplementation
  implements ISectionProductRelationService
{
  constructor(
    @Inject(ISectionProductRepository)
    private sectionProductRepository: ISectionProductRepository,
    @Inject(forwardRef(() => IProductService)) private productService: IProductService,
    @Inject(forwardRef(() => ISectionService))
    private sectionService: ISectionService,
  ) {}
  getAllByCondition(
    condition: SectionProductRelationQueryConditionType,
  ): Promise<SectionProductRelationModel[]> {
    return this.sectionProductRepository.findAllByCondition(condition);
  }
  getDetailByCondition(
    condition: SectionProductRelationQueryConditionType,
  ): Promise<SectionProductRelationModel> {
    return this.sectionProductRepository.findOneByCondition(condition);
  }
  async create(
    payload: CreateSectionProductRelationPayloadDto,
  ): Promise<SectionProductRelationModel> {
    try {
      const { product_id, section_id } = payload;
      const product = await this.productService.getProductDetail(product_id);
      if (!product) {
        throw new Error('Product not found');
      }
      if (product.type !== ProductTypeEnum.PHYSICAL) {
        throw new Error('Invalid product type');
      }
      const section =
        await this.sectionService.getSectionDetailByCondition({ id: section_id });
      if (!section) {
        throw new Error('Section not found');
      }
      if (
        [
          SectionTypeEnum.BATTERY_PRODUCT,
          SectionTypeEnum.INSURANCE_PRODUCT,
          SectionTypeEnum.SPARE_PARTS_PRODUCT,
          SectionTypeEnum.TIRE_WHEEL_PRODUCT,
          SectionTypeEnum.TOP_PRODUCT,
        ].indexOf(section.type) === -1
      ) {
        throw new Error('Invalid section type');
      }
      let isNotCreatable: boolean = false;
      const nExistedItem = await this.countByCondition({
        section_id: section_id,
      });
      switch (section.type) {
        case SectionTypeEnum.BATTERY_PRODUCT:
        case SectionTypeEnum.INSURANCE_PRODUCT:
        case SectionTypeEnum.SPARE_PARTS_PRODUCT:
        case SectionTypeEnum.TIRE_WHEEL_PRODUCT:
        case SectionTypeEnum.TOP_PRODUCT:
          isNotCreatable = nExistedItem >= 20;
          break;
        default:
          console.log(`Section type: ${section.type}`);
          break;
      }
      if (isNotCreatable) {
        throw new Error('Maximum capacity reached');
      }
      const existedItem = await this.getDetailByCondition({
        section_id: section.id,
        product_id: product.id,
      });
      if (existedItem) {
        throw new Error('Section Product Item already exists');
      }
      if (section.type === SectionTypeEnum.TOP_PRODUCT) {
        await product.update({ is_top_product: true });
      }
      return this.sectionProductRepository.create({
        product_id: product.id,
        section_id: section.id,
      });
    } catch (error) {
      throw error;
    }
  }
  async updateByCondition(
    condition: SectionProductRelationQueryConditionType,
    payload: UpdateSectionProductRelationPayloadDto,
  ): Promise<SectionProductRelationModel> {
    try {
      const { new_order } = payload;
      const existedItem = await this.getDetailByCondition(condition);
      if (!existedItem) {
        throw new Error('Section Product Item not found');
      }
      const orderPlacedItem =
        await this.sectionProductRepository.findOneByCondition({
          order: new_order,
        });
      if (orderPlacedItem) {
        await orderPlacedItem.update({ order: existedItem.order });
      }
      const [nModified, items] =
        await this.sectionProductRepository.updateByCondition(condition, {
          order: new_order,
        });
      if (!nModified) {
        throw new Error('Cannot update Section Product Item');
      }
      const updatedItem = items[0];
      return updatedItem;
    } catch (error) {
      throw error;
    }
  }
  async deleteByCondition(
    condition: SectionProductRelationQueryConditionType,
  ): Promise<boolean> {
    try {
      const existedItem =
        await this.sectionProductRepository.findOneByCondition(condition);
      if (!existedItem) {
        throw new Error('Section Product Item not found');
      }
      const product = await this.productService.getProductDetailByCondition(
        { id: condition.product_id },
      );
      if (!product) {
        throw new Error('Product not found');
      }
      const section = await this.sectionService.getSectionDetailByCondition({ id: condition.section_id });
      if (!section) {
        throw new Error('Section not found');
      }
      if (section.type === SectionTypeEnum.TOP_PRODUCT) {
        await product.update({ is_top_product: false });
      }
      const nDeleted = await this.sectionProductRepository.deleteByCondition(
        condition,
      );
      return !!nDeleted;
    } catch (error) {
      throw error;
    }
  }
  countByCondition(condition: any): Promise<number> {
    const { limit, offset, ...rest } = condition;
    return this.sectionProductRepository.countByCondition(rest);
  }
}
