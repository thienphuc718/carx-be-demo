'use strict';
const schemaConfig = require(__dirname + '../../config/schema.js');
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
    return queryInterface.bulkInsert(
      'customer_classes',
      [
        {
          id: '71b74bae-79e2-4b12-b498-dd4a2f5d6c05',
          name: 'Thành viên Đồng',
          min_point: 0,
          max_point: 1000,
          code: 'BRONZE',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: '96756bba-6bb2-4e61-a009-8fe8dc55eb50',
          name: 'Thành viên Bạc',
          min_point: 1001,
          max_point: 8000,
          code: 'SILVER',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: '0381d003-a84c-415d-a278-5e08dfe9322a',
          name: 'Thành viên Vàng',
          min_point: 8001,
          max_point: 9999999,
          code: 'GOLD',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {
        schema: schemaConfig.name,
      },
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('customer_classes', null, {
      schema: schemaConfig.name,
    });
  },
};
