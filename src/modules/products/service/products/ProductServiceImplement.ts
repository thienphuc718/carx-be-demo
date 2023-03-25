import { forwardRef, Inject } from '@nestjs/common';
import { ProductModel } from '../../../../models';
import {
  CreateInsuranceProductDto,
  CreateProductAttributeSelectedEntityDto,
  CreateProductCategorySelectedEntityDto,
  CreateProductEntityDto,
  CreateProductPayloadDto,
  FilterListProductDto,
  FilterListProductDtoV2,
  ProductPayloadDto,
} from '../../dto/ProductDto';
import {
  CreateProductVariantEntityDto,
  ProductVariantPayloadDto,
  UpdateProductVariantPayloadDto,
} from '../../dto/ProductVariantDto';
import { generateSlug, removeVietnameseTones } from '../../../../helpers/stringHelper';
import {
  ProductExcelColumnEnum,
  ProductGuaranteeTimeUnitEnum,
  ProductStatusEnum,
  ProductTypeEnum,
} from '../../enum/ProductEnum';
import { IProductVariantRepository } from '../../repository/product-variants/ProductVariantRepositoryInterface';
import { IProductRepository } from '../../repository/products/ProductRepositoryInterface';
import { IProductService } from './ProductServiceInterface';
import { IUserService } from '../../../users/service/UserServiceInterface';
import { IForbiddenKeywordService } from '../../../forbidden-keywords/service/ForbiddenKeywordServiceInterface';
import { IOrderItemService } from '../../../orders/service/order-item/OrderItemServiceInterface';
import { Op } from 'sequelize';
import * as Excel from 'exceljs';
import { plainToClass } from 'class-transformer';
import { validate, ValidatorOptions } from 'class-validator';
import { AppGateway } from '../../../../gateway/AppGateway';
import { IOrderService } from '../../../orders/service/order/OrderServiceInterface';
import { OrderStatusEnum, OrderTypeEnum } from '../../../orders/enum/OrderEnum';
import { countBy, isArray, isNil } from 'lodash';
import { InsuranceProductServiceInterface } from '../insurance-products/InsuranceProductServiceInterface';
import { VehicleTypeList } from '../../constants/InsuranceProductConstants';
import { InsuranceProductEntityDto } from '../../dto/InsuranceProductDto';
import { IAgentService } from '../../../agents/service/AgentServiceInterface';
import {
  ISectionProductRelationService,
} from '../../../sections/section-product-relation/service/SectionProductRelationServiceInterface';

export class ProductServiceImplementation implements IProductService {
  constructor(
    @Inject(IProductRepository)
    private productRepository: IProductRepository,
    @Inject(IProductVariantRepository)
    private productVariantRepository: IProductVariantRepository,
    @Inject(forwardRef(() => IUserService)) private userService: IUserService,
    @Inject(forwardRef(() => IOrderItemService))
    private orderItemService: IOrderItemService,
    @Inject(forwardRef(() => IForbiddenKeywordService))
    private forbiddenKeywordService: IForbiddenKeywordService,
    @Inject(AppGateway) private appGateway: AppGateway,
    @Inject(forwardRef(() => IOrderService)) private orderService: IOrderService,
    @Inject(InsuranceProductServiceInterface) private insuranceProductService: InsuranceProductServiceInterface,
    @Inject(forwardRef(() => IAgentService)) private agentService: IAgentService,
    @Inject(forwardRef(() => ISectionProductRelationService)) private sectionProductService: ISectionProductRelationService,
  ) { }

  async checkProductSkuExist(sku: string): Promise<boolean> {
    let count = await this.productVariantRepository.countByCondition({
      sku: sku,
    });
    return count !== 0;
  }

  async getProductList(
    getProductsDto: FilterListProductDto,
  ): Promise<ProductModel[]> {
    try {
      const { limit, page, distance, latitude, longitude, ...rest } = getProductsDto;
      const condition = this.buildSearchQueryCondition(rest);
      if (distance || latitude || longitude) {
        if (!(distance && latitude && longitude)) {
          throw new Error('Missing required properties to find products by geolocation');
        }
        const agents = await this.agentService.getAgentListByDistanceWithoutPagination({
          is_deleted: false,
          is_hidden: false,
          distance,
          longitude,
          latitude,
        });
        condition.agent_id = agents.map(agent => agent.id);
      }
      if (getProductsDto.agent_id) {
        const agent = await this.agentService.getAgentDetails(getProductsDto.agent_id);
        if (agent.category_id === '65a347b9-3c84-4e23-9856-c7245d7bdffd') {
          condition.is_insurance_product = true;
        }
      }
      return this.productRepository.findAllByCondition(
        limit,
        (page - 1) * limit,
        condition,
        getProductsDto.name?.toString().split(' '),
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getProductDetail(id: string): Promise<ProductModel> {
    try {
      const product = await this.productRepository.findById(id);
      if (product) {
        return product;
      } else {
        throw new Error('product not found');
      }
    } catch (error) {
      throw error;
    }
  }

  buildProductAttributeSelectedFromVariantList(
    variants: ProductVariantPayloadDto[],
    product: ProductModel,
  ): CreateProductAttributeSelectedEntityDto[] {
    try {
      let attributeArray: CreateProductAttributeSelectedEntityDto[] = [];
      if (variants) {
        for (let i = 0; i < variants.length; i++) {
          let variant = variants[i];
          for (let j = 0; j < variant.value.length; j++) {
            let index = -1;
            // add attribute to array if not exists
            let attribute = variant.value[j];
            for (let k = 0; k < attributeArray.length; k++) {
              if (attributeArray[k].attribute_id == attribute.attribute_id) {
                index = k;
              }
            }
            if (index === -1) {
              attributeArray.push({
                attribute_id: attribute.attribute_id,
                product_id: product.id,
                order: attributeArray.length + 1,
                values: [attribute.attribute_value],
              });
            } else {
              // check if attributeArray[index].values
              let checkExists = attributeArray[index].values.filter(
                (attributeValue) =>
                  attributeValue.code == attribute.attribute_value.code,
              );
              if (!checkExists.length) {
                attributeArray[index].values.push(attribute.attribute_value);
              }
            }
          }
        }
      }
      return attributeArray;
    } catch (error) {
      throw error;
    }
  }

  async createProduct(
    payload: ProductPayloadDto,
    userId: string,
    serviceCallback?: (
      transaction: any,
      newProduct: ProductModel,
    ) => Promise<void>,
  ): Promise<ProductModel> {
    try {
      const user = await this.userService.getUserDetail(userId, 'public');
      if (!user) throw new Error('User does not exist');
      const agent = user.agent_details;
      if (!agent) throw new Error('Current user is not an agent');
      const agent_id = agent.id;
      if (payload.sku) {
        const existSku = await this.checkProductSkuExist(payload.sku);
        if (existSku) {
          throw new Error('Product SKU exists');
        }
      }

      const checkForbiddenKeyword = await this.forbiddenKeywordService.checkKeywordsExist([
        payload.name,
        payload.description
      ]);
      if (checkForbiddenKeyword) {
        let data = {
          message: 'Forbidden keywords exists',
          value: checkForbiddenKeyword,
          code: 'FORBIDDEN_KEYWORD_ERROR'
        }
        throw data;
      }
      const { category_ids, variants, sku, ...product } = payload;
      const is_variable: boolean =
        (variants && variants.length === 1 && !variants[0].value) || !variants
          ? false
          : true;
      if (payload.is_insurance_product && agent.category_id !== '65a347b9-3c84-4e23-9856-c7245d7bdffd') {
        throw new Error('Agent is not an insurance agent');
      }
      const productEntity: CreateProductEntityDto = {
        ...product,
        is_variable,
        status: agent.is_hidden ? ProductStatusEnum.INACTIVE : ProductStatusEnum.ACTIVE,
        slug: generateSlug(payload.name),
        agent_id: agent_id,
        agent_category_id: agent.category_id,
        converted_name: payload.name ? removeVietnameseTones(payload.name) : '',
      };
      const repositoryCallback = async (
        transaction: any,
        newProduct: ProductModel,
      ) => {
        const categoryArray: CreateProductCategorySelectedEntityDto[] =
          category_ids
            ? category_ids.map((category_id) => ({
              product_id: newProduct.id,
              category_id,
            }))
            : [];
        const variantArray: CreateProductVariantEntityDto[] = variants
          ? variants.map((variant) => ({
            ...variant,
            discount_price:
              ((payload.price - payload.discount_price) / payload.price) *
              100,
            product_id: newProduct.id,
            sku: `${+new Date()}`,
          }))
          : [
            {
              product_id: newProduct.id,
              sku: payload.sku ? payload.sku : `${+new Date()}`,
              ...product,
            } as CreateProductVariantEntityDto,
          ];
        const attributeArray =
          this.buildProductAttributeSelectedFromVariantList(
            variants,
            newProduct,
          );
        // add value to attribute value if not exist yet
        // attributeArray.forEach((attribute) => {
        //   this.productAttributeService.bulkAddValue(
        //     attribute.attribute_id,
        //     attribute.values,
        //   );
        // });
        await Promise.all([
          this.productRepository.bulkCreateProductAttributeSelected(
            attributeArray,
            transaction,
          ),
          this.productRepository.bulkCreateProductCategorySelected(
            categoryArray,
            transaction,
          ),
          this.productVariantRepository.bulkCreate(variantArray, transaction),
          serviceCallback && serviceCallback(transaction, newProduct),
        ]);
      };

      const newProduct = await this.productRepository.create(
        productEntity,
        repositoryCallback,
      );
      return this.getProductDetail(newProduct.id);
    } catch (error) {
      throw error;
    }
  }

  async countProductByCondition(condition: any): Promise<number> {
    try {
      const { distance, longitude, latitude, ...rest } = condition;
      let conditionParams = this.buildSearchQueryCondition(rest);
      if (distance || latitude || longitude) {
        if (!(distance && latitude && longitude)) {
          throw new Error('Missing required properties to find products by geolocation');
        }
        const agents = await this.agentService.getAgentListByDistanceWithoutPagination({
          is_deleted: false,
          is_hidden: false,
          distance,
          longitude,
          latitude,
        });
        if (agents) {
          conditionParams.agent_id = agents.map(agent => agent.id);
        }
      }
      if (condition.agent_id) {
        const agent = await this.agentService.getAgentDetails(condition.agent_id);
        if (agent.category_id === '65a347b9-3c84-4e23-9856-c7245d7bdffd') {
          conditionParams.is_insurance_product = true;
        }
      }
      return this.productRepository.countByCondition(
        conditionParams,
        condition.name?.toString().split(' '),);
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(
    id: string,
    payload: ProductPayloadDto,
  ): Promise<ProductModel> {
    try {
      const { category_ids, variants, ...updatePayload } = payload;
      const productDetails = await this.productRepository.findById(id);
      if (!productDetails) {
        throw new Error('Product not found');
      }
      const callback = async (transaction: any) => {
        // update product categories
        if (category_ids?.length) {
          await this.updateProductCategory(id, category_ids, transaction);
        }

        // update product without variant
        if (!productDetails.is_variable) {
          const variant =
            await this.productVariantRepository.findOneByCondition({
              product_id: id,
            });
          const updateProductVariantPayload: UpdateProductVariantPayloadDto = {
            images: updatePayload.images,
            price: updatePayload.price,
            discount_price: updatePayload.discount_price,
            quantity: updatePayload.quantity,
          };
          await this.productVariantRepository.update(
            variant.id,
            updateProductVariantPayload,
            transaction,
          );
        }

        // update product with variants
        if (productDetails.is_variable) {
          await Promise.all(
            variants.map((variant) => {
              const { variant_id, ...variantPayload } = variant;
              return this.productVariantRepository.update(
                variant_id,
                variantPayload,
                transaction,
              );
            }),
          );
        }
      };

      const checkForbiddenKeyword = await this.forbiddenKeywordService.checkKeywordsExist([
        payload.name,
        payload.description
      ]);
      if (checkForbiddenKeyword) {
        let data = {
          message: 'Forbidden keywords exists',
          value: checkForbiddenKeyword,
          code: 'FORBIDDEN_KEYWORD_ERROR'
        }
        throw data;
      }
      if (updatePayload.name) {
        updatePayload.converted_name = removeVietnameseTones(updatePayload.name);
      }
      await this.productRepository.updateProduct(id, updatePayload, callback);
      return this.getProductDetail(id);
    } catch (error) {
      throw error;
    }
  }

  async updateProductCategory(
    productId: string,
    categoryIds: string[],
    transaction: any,
  ): Promise<void> {
    try {
      const existedCategories =
        await this.productRepository.findProductCategorySelectedByCondition({
          where: { product_id: productId },
        });
      const existedCategoryIds: string[] = existedCategories.map(
        (existedCat) => existedCat.category_id,
      );
      const createNewProductCategoryIds: string[] = categoryIds.filter(
        (catId) => !existedCategoryIds.includes(catId),
      );
      const reSelectCategoryIds: string[] = categoryIds.filter((catId) =>
        existedCategories.find(
          (cat) => cat.category_id === catId && cat.is_deleted === true,
        ),
      );
      const removeCategoryIds: string[] = existedCategoryIds.filter(
        (existedId) => !categoryIds.includes(existedId),
      );
      if (createNewProductCategoryIds.length) {
        const createNewProductCategoryArray = createNewProductCategoryIds.map(
          (category_id) => ({
            product_id: productId,
            category_id,
          }),
        );
        await this.productRepository.bulkCreateProductCategorySelected(
          createNewProductCategoryArray,
          transaction,
        );
      }
      if (reSelectCategoryIds.length) {
        await Promise.all(
          reSelectCategoryIds.map((category_id) =>
            this.productRepository.updateProductCategorySelectedByCondition(
              { is_deleted: false },
              { product_id: productId, category_id },
              transaction,
            ),
          ),
        );
      }
      if (removeCategoryIds.length) {
        await Promise.all(
          removeCategoryIds.map((category_id) =>
            this.productRepository.updateProductCategorySelectedByCondition(
              { is_deleted: true },
              { product_id: productId, category_id },
              transaction,
            ),
          ),
        );
      }
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(
    id: string,
    serviceCallback?: (transaction: any) => Promise<void>,
  ): Promise<[number, ProductModel[]]> {
    try {
      const product = await this.getProductDetail(id);
      if (!product) {
        throw new Error(`Product not found ${id}`);
      }
      const repositoryCallback = async (transaction) => {
        await Promise.all([
          this.productRepository.deleteProductAttributeSelected(
            id,
            transaction,
          ),
          this.productRepository.deleteProductCategorySelected(id, transaction),
          this.productVariantRepository.deleteByCondition(
            { product_id: id },
            transaction,
          ),
          serviceCallback && serviceCallback(transaction),
        ]);
      };
      const result = await this.productRepository.deleteProduct(
        id,
        repositoryCallback,
      );
      const sectionProduct = await this.sectionProductService.getDetailByCondition({
        product_id: product.id
      });
      if (sectionProduct) {
        await this.sectionProductService.deleteByCondition({ product_id: product.id, section_id: sectionProduct.section_id });
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  async deleteMultipleProducts(ids: string[]) {
    try {
      await Promise.all(ids.map((id) => this.deleteProduct(id)));
    } catch (error) {
      throw error;
    }
  }

  async getProductSelectAttributeIds(productId: string): Promise<string[]> {
    try {
      const selectedAttributes =
        await this.productRepository.findProductAttributeSelectedByCondition({
          product_id: productId,
        });
      return selectedAttributes.map((attribute) => attribute.attribute_id);
    } catch (error) {
      throw error;
    }
  }

  async getProductTotalSoldBySku(productSku: string): Promise<number> {
    const orderItems = await this.orderItemService.getOrderItemListByCondition({
      product_sku: productSku,
    });
    return orderItems
      .map((orderItem) => orderItem.quantity)
      .reduce((a, b) => a + b, 0);
  }

  async getRelatedProductsByProductId(
    product_id: string,
  ): Promise<[number, ProductModel[]]> {
    try {
      const product = await this.getProductDetail(product_id);
      if (!product) {
        throw new Error('Product not found');
      }
      const agentId = product.agent_id;
      const params = {
        agent_id: agentId,
        type: ProductTypeEnum.PHYSICAL,
        status: ProductStatusEnum.ACTIVE,
      };
      return Promise.all([
        this.productRepository.countByCondition(params),
        this.productRepository.findAllByConditionRandomlyOrdered(10, 0, params),
      ]);
    } catch (error) {
      throw error;
    }
  }

  async getProductListByConditionWithoutPagination(condition: any): Promise<ProductModel[]> {
    try {
      return this.productRepository.findAllByConditionWithoutPagination(condition);
    } catch (error) {
      throw error;
    }
  }

  async bulkUpload(file: any, userId: string): Promise<any> {
    try {
      let result = null;
      const EXCEL_MIMETYPE =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

      // if not excel file
      if (file.mimetype !== EXCEL_MIMETYPE) {
        this.appGateway.server.emit(`ROOM_${userId}`, {
          action: 'EVENT_PRODUCT_BULK_IMPORT',
          data: {
            success: 0,
            message: 'Invalid file',
          },
          channel: 'CARX_PRODUCT',
        });
        return 0;
      }

      const lstCreateProducts: CreateProductPayloadDto[] = [];
      const workbook = new Excel.Workbook();
      await workbook.xlsx.load(file.buffer);

      // Iterate over all rows (including empty rows) in a worksheet
      // Only get data from first sheet
      workbook.worksheets[0].eachRow(
        { includeEmpty: true },
        (row, rowNumber) => {
          if (rowNumber > 1) {
            // skip header row
            let guaranteeTime = 0;
            let guaranteeTimeUnit = ProductGuaranteeTimeUnitEnum.DAY;
            if (row.values[ProductExcelColumnEnum.DAY_GUARANTEE_TIME]) {
              guaranteeTime =
                row.values[ProductExcelColumnEnum.DAY_GUARANTEE_TIME];
              guaranteeTimeUnit = ProductGuaranteeTimeUnitEnum.DAY;
            } else if (
              row.values[ProductExcelColumnEnum.MONTH_GUARANTEE_TIME]
            ) {
              guaranteeTime =
                row.values[ProductExcelColumnEnum.MONTH_GUARANTEE_TIME];
              guaranteeTimeUnit = ProductGuaranteeTimeUnitEnum.MONTH;
            } else if (row.values[ProductExcelColumnEnum.YEAR_GUARANTEE_TIME]) {
              guaranteeTime =
                row.values[ProductExcelColumnEnum.YEAR_GUARANTEE_TIME];
              guaranteeTimeUnit = ProductGuaranteeTimeUnitEnum.YEAR;
            }

            let images: string[] = [];
            if (row.values[ProductExcelColumnEnum.IMAGES]) {
              if (row.values[ProductExcelColumnEnum.IMAGES].text) {
                images = [row.values[ProductExcelColumnEnum.IMAGES].text];
              } else {
                images = [row.values[ProductExcelColumnEnum.IMAGES]];
              }
              // images = row.values[ProductExcelColumnEnum.IMAGES].split('\n'); // each image is separated in a new line
            }

            const rowData = {
              sku: row.values[ProductExcelColumnEnum.PRODUCT_CODE] + '',
              images: images,
              name: row.values[ProductExcelColumnEnum.NAME],
              price: row.values[ProductExcelColumnEnum.PRICE] ?? 0,
              discount_price:
                row.values[ProductExcelColumnEnum.DISCOUNT_PRICE] ?? 0,
              is_guaranteed: !!row.values[ProductExcelColumnEnum.IS_GUARANTEED],
              guarantee_time: guaranteeTime,
              guarantee_time_unit: guaranteeTimeUnit,
              guarantee_note: row.values[ProductExcelColumnEnum.GUARANTEE_NOTE],
              description: row.values[ProductExcelColumnEnum.DESCRIPTION],
              quantity: row.values[ProductExcelColumnEnum.QUANTITY] ?? 0,
            };

            const createProductDto: CreateProductPayloadDto = plainToClass(
              CreateProductPayloadDto,
              rowData,
              {
                excludeExtraneousValues: false,
                enableImplicitConversion: false,
              },
            );

            if (createProductDto.name) {
              lstCreateProducts.push(createProductDto);
            }
          }
        },
      );

      // if excel sheet is empty
      if (lstCreateProducts.length === 0) {
        this.appGateway.server.emit(`ROOM_${userId}`, {
          action: 'EVENT_PRODUCT_BULK_IMPORT',
          data: {
            success: 0,
            message: 'There is no data detected',
          },
          channel: 'CARX_PRODUCT',
        });
        return 0;
      }
      // validate data
      const validatorOptions: ValidatorOptions = {
        whitelist: true, // strips all properties that don't have any decorators
        skipMissingProperties: false,
        skipUndefinedProperties: false,
        forbidUnknownValues: true,
        validationError: {
          target: false,
          value: true,
        },
      };

      let rowIdx = 0;
      const errorRows = [];
      for (const productDto of lstCreateProducts) {
        rowIdx++;
        let errorMessages = [];
        const errors = await validate(productDto, validatorOptions);

        if (errors.length > 0) {
          errors.map(
            (err) =>
            (errorMessages = errorMessages.concat(
              Object.values(err.constraints),
            )),
          );
          errorRows.push({ row: rowIdx, errors: errorMessages });
        }
      }

      if (errorRows.length > 0) {
        this.appGateway.server.emit(`ROOM_${userId}`, {
          action: 'EVENT_PRODUCT_BULK_IMPORT',
          data: {
            success: 0,
            data: errorRows,
            message: 'There is invalid data detected',
          },
          channel: 'CARX_PRODUCT',
        });
        return 0;
      }

      let importResult = [];
      let index = 0;
      // import product
      for (const productDto of lstCreateProducts) {
        try {
          index++;
          let product = await this.createProduct(
            {
              ...productDto,
            },
            userId,
          );
          importResult.push({
            success: 1,
            row: index,
            data: product,
          });
        } catch (error) {
          importResult.push({
            success: 0,
            row: index,
            data: error.message,
          });
        }
      }
      console.log('**** importResult');
      console.log(importResult);
      this.appGateway.server.emit(`ROOM_${userId}`, {
        action: 'EVENT_PRODUCT_BULK_IMPORT',
        data: {
          success: 1,
          message: 'Successfully import products',
          result: importResult,
        },
        channel: 'CARX_PRODUCT',
      });
      return 0;
    } catch (error) {
      this.appGateway.server.emit(`ROOM_${userId}`, {
        action: 'EVENT_PRODUCT_BULK_IMPORT',
        data: error,
        channel: 'CARX_PRODUCT',
      });
      return 0;
    }
  }

  async getMostCompletedOrderProduct(): Promise<ProductModel[]> {
    try {
      const orders = await this.orderService.getOrderListByConditionWithoutPagination({
        type: OrderTypeEnum.PHYSICAL_PURCHASED,
        status: OrderStatusEnum.COMPLETED,
      });
      const orderItems = await Promise.all(
        orders.map(order => this.orderItemService.getOrderItemByCondition({ order_id: order.id, is_deleted: false }))
      );
      const productIds = orderItems.filter(item => !!item).map(orderItem => orderItem.product_id);
      const productIdsCount = countBy(productIds);
      const conditionArray = Object.entries(productIdsCount).map(entry => ({
        id: entry[0],
        count: entry[1]
      })).sort((a, b) => b.count - a.count);
      return this.productRepository.findAllByCondition(20, 0, { id: conditionArray.map(condition => condition.id), is_deleted: false, status: ProductStatusEnum.ACTIVE });
    } catch (error) {
      throw error;
    }
  }

  getMostViewCountProduct(): Promise<ProductModel[]> {
    return this.productRepository.findAllByCondition(
      20,
      0,
      {
        is_deleted: false,
        status: ProductStatusEnum.ACTIVE,
        is_flash_buy: false,
        type: ProductTypeEnum.PHYSICAL,
      },
      'view_count',
      'desc');
  }

  async addViewCount(productId: string): Promise<ProductModel> {
    try {
      const product = await this.getProductDetail(productId);
      if (!product) {
        throw new Error('Product not found');
      }
      let currentViewCount = Number(product.view_count);
      await product.update({ view_count: ++currentViewCount });
      return product;
    } catch (error) {
      throw error;
    }
  }

  getProductListByConditionV2(filterProductDto: FilterListProductDtoV2): Promise<ProductModel[]> {
    try {
      const { limit, page, ...rest } = filterProductDto;
      const condition = this.buildSearchQueryCondition(rest);
      return this.productRepository.findAllByConditionV2(limit, (page - 1) * limit, condition);
    } catch (error) {
      throw error;
    }
  }

  private validateInsuranceProductInfo(insuranceProductPayload: InsuranceProductEntityDto) {
    try {
      const insuranceProductInfo = VehicleTypeList.find(item => item.car_type_code === insuranceProductPayload.car_type_code);
      if (!insuranceProductInfo) {
        throw new Error('Invalid car_type_code');
      }
      const insuranceProductUsageInfo = insuranceProductInfo.usage.find(item => insuranceProductPayload.usage_code === item.code && insuranceProductPayload.capacity === item.capacity);
      if (!insuranceProductUsageInfo) {
        throw new Error('Invalid usage_code or capacity error');
      }
      const insuranceProductUsageInformation = insuranceProductUsageInfo.information;
      if (insuranceProductPayload.is_voluntary) {
        if (
          !insuranceProductPayload.voluntary_amount ||
          !insuranceProductPayload.voluntary_seats ||
          !insuranceProductPayload.voluntary_price
        ) {
          throw new Error('Missing voluntary properties')
        }
        if (!insuranceProductUsageInfo.combo) {
          throw new Error('This product cannot be a voluntary insurance product');
        }
        // if (insuranceProductUsageInfo.combo.insurance_time !== insuranceProductPayload.max_insurance_time) {
        //   throw new Error('Invalid max voluntary insurance product time');
        // }
        if (insuranceProductUsageInfo.combo.amount !== insuranceProductPayload.voluntary_amount) {
          throw new Error('Invalid voluntary amount')
        }
        if (insuranceProductUsageInfo.combo.price !== insuranceProductPayload.voluntary_price) {
          throw new Error('Invalid voluntary price');
        }
      }
      if (insuranceProductInfo.insurance_amount !== insuranceProductPayload.insurance_amount) {
        throw new Error('Invalid insurance_amount');
      }
      // if (
      //   insuranceProductPayload.car_type_code === '22' &&
      //   insuranceProductPayload.usage_code === '90' &&
      //   insuranceProductPayload.is_business
      // ) {
      //   throw new Error('is_business should be false');
      // }
      if (insuranceProductUsageInfo.unit !== insuranceProductPayload.capacity_unit) {
        throw new Error('Invalid capacity_unit');
      }
      // if (insuranceProductUsageInformation.map(item => item.insurance_time).indexOf(insuranceProductPayload.max_insurance_time) === -1) {
      //   throw new Error('Invalid insurance time')
      // }
      if (insuranceProductUsageInformation.map(item => item.non_taxed_price).indexOf(insuranceProductPayload.required_non_tax_price) === -1) {
        throw new Error('Invalid required_non_tax_price');
      }
    } catch (error) {
      throw error;
    }
  }

  async createInsuranceProduct(payload: CreateInsuranceProductDto, userId: string): Promise<ProductModel> {
    try {
      const { insurance_product_info, ...rest } = payload;
      this.validateInsuranceProductInfo(insurance_product_info);
      const createdProduct = await this.createProduct({
        ...rest,
        type: ProductTypeEnum.PHYSICAL,
        is_flash_buy: false,
        is_guaranteed: false,
        quantity: 9999,
        is_insurance_product: true,
      }, userId);
      if (!createdProduct) {
        throw new Error('Cannot create product');
      }
      const insuranceProductDto = {
        ...insurance_product_info,
        product_id: createdProduct.id,
      }
      await this.insuranceProductService.createInsuranceProduct(insuranceProductDto, userId);
      return this.getProductDetail(createdProduct.id);
    } catch (error) {
      throw error;
    }
  }

  async updateProductByCondition(condition: any, payload: ProductPayloadDto): Promise<boolean> {
    try {
      const [nModified, products] = await this.productRepository.updateByCondition(condition, payload);
      if (!products.length) {
        throw new Error('Cannot update product')
      }
      return !!nModified;
    } catch (error) {
      throw error;
    }
  }

  buildSearchQueryCondition(condition: Record<string, any>) {
    const { is_status_included = true, ...rest } = condition;
    let queryCondition: Record<string, any> = {
      type: ProductTypeEnum.PHYSICAL,
      is_deleted: false,
      is_flash_buy: false,
      ...rest,
    };

    const removeKeys = ['limit', 'page'];
    for (const key of Object.keys(queryCondition)) {
      for (const value of removeKeys) {
        if (key === value) {
          delete queryCondition[key];
        }
      }
    }

    if (queryCondition.max_price || queryCondition.min_price) {
      if (queryCondition.max_price < 1) {
        throw new Error('Max price must be higher than 1');
      }
      if (queryCondition.min_price > queryCondition.max_price) {
        throw new Error('Min price and max price must be smaller than max price');
      }
      delete queryCondition.max_price;
      delete queryCondition.min_price;
      queryCondition = {
        ...queryCondition,
        variantCondition: {
          is_deleted: false,
          price: {
            ...(condition.min_price && { [Op.gte]: condition.min_price }),
            ...(condition.max_price && { [Op.lte]: condition.max_price }),
          },
        },
      }
    }
    if ((isNil(condition.agent_id) || !isArray(condition.agent_id)) && is_status_included) {
      queryCondition.status = ProductStatusEnum.ACTIVE;
    }
    if (queryCondition.agent_category_ids) {
      queryCondition = {
        ...queryCondition,
        agent_category_id: queryCondition.agent_category_ids
      }
      delete queryCondition.agent_category_ids;
    }
    if (!isNil(condition.is_combo)) {
      if (!condition.is_insurance_product) {
        throw new Error('is_insurance_product must be specified as true');
      }
      queryCondition = {
        ...queryCondition,
        insuranceProductCondition: {
          is_combo: condition.is_combo,
          is_voluntary: condition.is_combo,
        }
      }
      delete queryCondition.is_combo;
    }
    return queryCondition;
  }

  async getProductDetailAndAddViewCount(id: string) {
    try {
      const product = await this.getProductDetail(id);
      let currentProductViewCount = product.view_count;
      product.update({ view_count: ++currentProductViewCount });
      return product;
    } catch (error) {
      throw error;
    }
  }

  getProductDetailByCondition(condition: any) {
    return this.productRepository.findOneByCondition(condition);
  }
}
