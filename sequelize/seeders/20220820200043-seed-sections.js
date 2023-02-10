'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    return queryInterface.bulkInsert('sections', [
      {
        id: '21635c16-e69a-410b-b3a4-c0ca3683208d',
        name: 'Đại lý chính hãng',
        config: JSON.stringify({
          layout: '2x2',
          auto_play: true,
        }),
        type: 'AUTHENTIC_AGENT',
        is_item_editable: true,
        is_enabled: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '55e009cc-8c73-4966-b449-ec6a4587854c',
        name: 'Đại lý nổi bật',
        config: JSON.stringify({
          layout: '2x2',
          auto_play: false,
        }),
        type: 'TOP_AGENT',
        is_item_editable: true,
        is_enabled: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 'b0ff9d66-f232-45f4-bd7e-d7f69a21e85a',
        name: 'Hot Deal',
        config: JSON.stringify({
          layout: '2x2',
          auto_play: true,
        }),
        type: 'HOT_DEAL',
        is_item_editable: true,
        is_enabled: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '170d47f1-4b12-420e-89aa-1a27d7b978b4',
        name: 'Sản phẩm nổi bật',
        config: JSON.stringify({
          layout: '2x2',
          auto_play: false,
        }),
        type: 'TOP_PRODUCT',
        is_item_editable: true,
        is_enabled: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '326fcf00-00eb-4ce9-9b62-a6b0f8f04ecd',
        name: 'Sản phẩm bán chạy',
        config: JSON.stringify({
          layout: '2x2',
          auto_play: true,
        }),
        type: 'BEST_SELLER_PRODUCT',
        is_item_editable: false,
        is_enabled: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 'f4a150bc-7b5a-412b-bda2-3dc29459dff3',
        name: 'Sản phẩm tìm kiếm nhiều',
        config: JSON.stringify({
          layout: '2x2',
          auto_play: true,
        }),
        type: 'MOST_VIEWED_PRODUCT',
        is_item_editable: false,
        is_enabled: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 'cd209a9c-e8f8-465c-beca-c7d6d296db8a',
        name: 'Dịch vụ tìm kiếm nhiều',
        config: JSON.stringify({
          layout: '2x2',
          auto_play: true,
        }),
        type: 'MOST_VIEWED_SERVICE',
        is_item_editable: false,
        is_enabled: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '92054888-8130-4d63-803c-1898255c3877',
        name: 'Phụ tùng',
        config: JSON.stringify({
          layout: '1x2',
          auto_play: false,
        }),
        type: 'SPARE_PARTS_PRODUCT',
        mobile_screen: 'ProductList',
        is_item_editable: true,
        is_enabled: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '56bbb368-c002-4167-95ad-913f7c766fce',
        name: 'Mâm lốp',
        config: JSON.stringify({
          layout: '1x2',
          auto_play: false,
        }),
        type: 'TIRE_WHEEL_PRODUCT',
        mobile_screen: 'ProductList',
        is_item_editable: true,
        is_enabled: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '7b495fcb-6329-4ae5-b726-a4c2faa543b2',
        name: 'Ắc quy',
        config: JSON.stringify({
          layout: '1x2',
          auto_play: false,
        }),
        type: 'BATTERY_PRODUCT',
        mobile_screen: 'ProductList',
        is_item_editable: true,
        is_enabled: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '8b4f1332-2f39-4466-b101-7e7fc40edb8a',
        name: 'Bảo hiểm',
        config: JSON.stringify({
          layout: '1x2',
          auto_play: false,
        }),
        type: 'INSURANCE_PRODUCT',
        mobile_screen: 'ProductList',
        is_item_editable: true,
        is_enabled: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 'a28891b2-4f04-4655-a131-0c0b14cec435',
        name: 'Khuyến mãi',
        config: JSON.stringify({
          layout: '1x2',
          auto_play: false,
        }),
        type: 'PROMOTION',
        is_item_editable: true,
        is_enabled: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '8375eff4-64b4-464e-9815-0dc44ae87102',
        name: 'Bài viết nổi bật',
        config: JSON.stringify({
          layout: '2x2',
          auto_play: false,
        }),
        type: 'TOP_POST',
        is_item_editable: true,
        is_enabled: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('sections', null, {});
  },
};
