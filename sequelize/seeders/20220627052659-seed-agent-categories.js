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
      await queryInterface.bulkDelete('agent_categories', null, {
        schema: schemaConfig.name,
      }),

      await queryInterface.bulkInsert(
        'agent_categories',
        [
          {
            id: '5530a10b-ffb8-43be-bb90-1d09c293cace',
            name: 'Sửa chữa bảo dưỡng',
            slug: 'sua-chua-bao-duong',
            image:
              'https://lannis-bucket.s3.ap-southeast-1.amazonaws.com/sua-chua-bao-duong.png',
            show_on_homepage: true,
            order: 1,
            mobile_screen: 'GarageList',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: 'f73f7e6e-ec44-402d-b0a3-c911c41f285a',
            name: 'Phụ tùng / phụ kiện',
            slug: 'phu-tung-phu-kien',
            image:
              'https://lannis-bucket.s3.ap-southeast-1.amazonaws.com/rua-xe.png',
            show_on_homepage: true,
            order: 3,
            mobile_screen: 'GarageList',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: 'ec0eb02a-1b2a-4593-ab91-9c269dbbb819',
            name: 'Mâm lốp',
            slug: 'mam-lop',
            image:
              'https://lannis-bucket.s3.ap-southeast-1.amazonaws.com/do-xe.png',
            show_on_homepage: true,
            order: 4,
            mobile_screen: 'GarageList',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '65a347b9-3c84-4e23-9856-c7245d7bdffd',
            name: 'Bảo hiểm',
            slug: 'bao-hiem',
            image:
              'https://lannis-bucket.s3.ap-southeast-1.amazonaws.com/bao-duong.png',
            show_on_homepage: true,
            order: 6,
            mobile_screen: 'GarageList',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: 'd74767b9-c048-4988-9bc8-b197df459dd4',
            name: 'Ắc quy',
            slug: 'ac-quy',
            image:
              'https://lannis-bucket.s3.ap-southeast-1.amazonaws.com/mua-ac-quy.png',
            show_on_homepage: true,
            order: 5,
            mobile_screen: 'GarageList',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '775fcb25-7cd5-4aa2-a792-75852574f9c8',
            name: 'Chăm sóc xe',
            slug: 'cham-soc-xe',
            image:
              'https://lannis-bucket.s3.ap-southeast-1.amazonaws.com/rua-xe.png',
            show_on_homepage: true,
            order: 8,
            mobile_screen: 'GarageList',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '9fda4127-580c-42c7-826b-f290dab4d296',
            name: 'Bãi đậu xe',
            slug: 'bai-dau-xe',
            image:
              'https://lannis-bucket.s3.ap-southeast-1.amazonaws.com/bao-duong.png',
            show_on_homepage: false,
            order: 9,
            mobile_screen: null,
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: 'cebc2a0c-70c7-48c2-b263-88e164d7bd75',
            name: 'Trạm đăng kiểm xe',
            slug: 'tram-dang-kiem-xe',
            image:
              'https://lannis-bucket.s3.ap-southeast-1.amazonaws.com/hop-so.png',
            show_on_homepage: false,
            order: 10,
            mobile_screen: null,
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: '4731559e-f9f2-4c19-9679-fcfc1ee50ee8',
            name: 'Độ xe',
            slug: 'do-xe',
            image:
              'https://lannis-bucket.s3.ap-southeast-1.amazonaws.com/do-xe.png',
            show_on_homepage: true,
            order: 7,
            mobile_screen: 'GarageList',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: 'd619d1a1-9313-4e9b-8a50-dd176177f0de',
            name: 'Cứu hộ',
            slug: 'cuu-ho',
            image:
              'https://lannis-bucket.s3.ap-southeast-1.amazonaws.com/cuu-ho.png',
            show_on_homepage: true,
            order: 2,
            mobile_screen: "RescueMap",
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
    return queryInterface.bulkDelete('agent_categories', null, {
      schema: schemaConfig.name,
    });
  },
};
