import { Op } from 'sequelize';
import { QueryProductByCategoryDto } from '../dto/ProductCategoryDto';

export function productQueryHelper(query: QueryProductByCategoryDto): any {
  const { brands, min_price, max_price, tags, order_by, order_type } = query;
  const productOptions: { brand_id?; tags? } = {};
  if (brands) {
    productOptions.brand_id = {
      [Op.in]: Array.isArray(brands) ? brands : [brands],
    };
  }
  if (tags) {
    productOptions.tags = {
      [Op.overlap]: Array.isArray(tags) ? tags : [tags],
    };
  }
  const priceOptions = max_price
    ? {
        [Op.and]: [
          { price: { [Op.gte]: min_price } },
          { price: { [Op.lte]: max_price } },
        ],
      }
    : { price: { [Op.gte]: min_price } };
  const orderOptions = [[order_by, order_type]];

  return { productOptions, priceOptions, orderOptions };
}
