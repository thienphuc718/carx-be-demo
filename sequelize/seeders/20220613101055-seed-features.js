'use strict';
const { v4: uuidv4 } = require('uuid');
const schemaConfig = require(__dirname + '../../config/schema.js');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const features = [
      { name: 'Quản lý hệ thống', slug: 'system-management', module: 'STAFFS' },
      { name: 'Quản lý nội dung', slug: 'content-management', module: 'CONTENTS' },
      { name: 'Quản lý người dùng', slug: 'user-management', module: 'CUSTOMERS' },
      { name: 'Quản lý đối tác', slug: 'agent-management', module: 'AGENTS' },
      { name: 'Quản lý đơn hàng', slug: 'order-management', module: 'ORDERS' },
      { name: 'Quản lý danh mục dịch vụ', slug: 'service-category-management', module: 'AGENT_CATEGORIES' },
      { name: 'Quản lý khuyến mãi', slug: 'promotion-management', module: 'PROMOTIONS' },
      { name: 'Quản lý tin tức', slug: 'news-management', module: 'NEWS' },
      { name: 'Cấu hình', slug: 'configs', module: 'CONFIGURATIONS' },
      { name: 'SMS và thông báo', slug: 'sms-notification', module: 'NOTIFICATIONS' },
      { name: 'Báo cáo', slug: 'reports', module: 'REPORTS' },
      { name: 'Quản lý giao diện App', slug: 'interface-management', module: 'USER_INTERFACE' }
    ];
    return queryInterface.bulkInsert(
      'features',
      features.map((feature) => ({
        id: uuidv4(),
        name: feature.name,
        slug: feature.slug,
        created_at: new Date(),
        updated_at: new Date(),
      })),
      { schema: schemaConfig.name },
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('features', null, {
      schema: schemaConfig.name,
    });
  },
};
