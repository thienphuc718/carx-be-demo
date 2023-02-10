'use strict';
const { v4: uuidv4 } = require('uuid');
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
    return Promise.all([
      await  queryInterface.bulkDelete('service_categories', null, {
        schema: schemaConfig.name,
      }),

      await queryInterface.bulkInsert(
        'service_categories',
        [
          {
            id: '62224493-4686-45a0-a960-427caeba6610',
            name: 'Động cơ',
            slug: 'dong-co',
            image:
              'https://lannis-bucket.s3.ap-southeast-1.amazonaws.com/sua-chua-bao-duong.png',
            show_on_homepage: true,
            order: 1,
            mobile_screen: "ServiceList",
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: 'a5ffb637-3f3f-469c-8bdd-9e3f12eaf482',
            name: 'Gầm',
            slug: 'gam',
            image:
              'https://lannis-bucket.s3.ap-southeast-1.amazonaws.com/rua-xe.png',
            show_on_homepage: true,
            order: 2,
            mobile_screen: "ServiceList",
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '07d9acfd-a624-4b0a-bf22-98e5765152be',
            name: 'Hộp số',
            slug: 'hop-so',
            image:
              'https://lannis-bucket.s3.ap-southeast-1.amazonaws.com/do-xe.png',
            show_on_homepage: true,
            order: 3,
            mobile_screen: "ServiceList",
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: 'ce678873-d847-4e14-a396-eedb754f4f57',
            name: 'Điều hòa',
            slug: 'dieu-hoa',
            image:
              'https://lannis-bucket.s3.ap-southeast-1.amazonaws.com/mua-lop-xe.png',
            show_on_homepage: true,
            order: 4,
            mobile_screen: "ServiceList",
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: 'c23be564-5407-4d68-bdc9-632a8eb8e3e6',
            name: 'Điện',
            slug: 'dien',
            image:
              'https://lannis-bucket.s3.ap-southeast-1.amazonaws.com/mua-ac-quy.png',
            show_on_homepage: true,
            order: 5,
            mobile_screen: "ServiceList",
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '0faf5815-7f58-4c35-8baf-b9f676bbfd29',
            name: 'Sơn',
            slug: 'son',
            image:
              'https://lannis-bucket.s3.ap-southeast-1.amazonaws.com/mua-phu-tung.png',
            show_on_homepage: true,
            order: 6,
            mobile_screen: "ServiceList",
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: 'bdc24a18-0f88-486c-b417-9f3283beeb59',
            name: 'Bảo dưỡng',
            slug: 'bao-duong',
            image:
              'https://lannis-bucket.s3.ap-southeast-1.amazonaws.com/cuu-ho.png',
            show_on_homepage: true,
            order: 7,
            mobile_screen: "ServiceList",
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: 'f1301021-2bdf-4728-894a-a06f2e3f9f15',
            name: 'Độ xe',
            slug: 'do-xe',
            image:
              'https://lannis-bucket.s3.ap-southeast-1.amazonaws.com/cuu-ho.png',
            show_on_homepage: true,
            order: 8,
            mobile_screen: "ServiceList",
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '08d38701-0597-4f8e-94bf-58c38c17ad15',
            name: 'Chăm sóc xe',
            slug: 'cham-soc-xe',
            image:
              'https://lannis-bucket.s3.ap-southeast-1.amazonaws.com/cuu-ho.png',
            show_on_homepage: true,
            order: 9,
            mobile_screen: "ServiceList",
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        { schema: schemaConfig.name },
      ),
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('service_categories', null, {
      schema: schemaConfig.name,
    });
  },
};
