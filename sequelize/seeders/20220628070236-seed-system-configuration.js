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
    return queryInterface.bulkInsert('system_configurations', [
      // {
      //   id: '16df5323-14ef-4e2e-a4d6-d58344307f3d',
      //   name: 'Phí sàn',
      //   apply_value: 0,
      //   apply_unit: 'VND',
      //   compare_value: null,
      //   compare_unit: null,
      //   is_deleted: false,
      //   is_enabled: true,
      //   created_at: new Date(),
      //   updated_at: new Date(),
      // },
      // {
      //   id: 'aaef582a-a37f-49ca-8bb9-73aabb8551c3',
      //   name: 'Sử dụng điểm',
      //   apply_value: 100,
      //   apply_unit: 'VND',
      //   compare_value: 1,
      //   compare_unit: 'Điểm',
      //   is_deleted: false,
      //   is_enabled: true,
      //   created_at: new Date(),
      //   updated_at: new Date(),
      // },
      // {
      //   id: '6b07e3ee-8865-469c-9a00-daab5cff6865',
      //   name: 'Tích luỹ điểm',
      //   apply_value: 10000,
      //   apply_unit: 'VND',
      //   compare_value: 1,
      //   compare_unit: 'Điểm',
      //   is_deleted: false,
      //   is_enabled: true,
      //   created_at: new Date(),
      //   updated_at: new Date(),
      // },
      // {
      //   id: '7fbc5281-7d97-4055-a970-546ad91f41a9',
      //   name: 'VAT',
      //   apply_value: 10,
      //   apply_unit: '%',
      //   compare_value: null,
      //   compare_unit: null,
      //   is_deleted: false,
      //   is_enabled: true,
      //   created_at: new Date(),
      //   updated_at: new Date(),
      // },
      {
        id: '6406a4ee-977d-4f95-b192-af5ebeda9b41',
        name: 'Điểm sử dụng trong ngày',
        apply_value: 10000,
        apply_unit: 'Điểm',
        compare_value: 1,
        compare_unit: 'Ngày',
        is_deleted: false,
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
    return queryInterface.bulkDelete('system_configurations', null, {});
  },
};
