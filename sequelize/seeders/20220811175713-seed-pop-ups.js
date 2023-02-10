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
    return Promise.all([
      await queryInterface.bulkInsert('pop_ups', [
        {
          id: 'f0133504-b305-47a8-82b5-e2125d0bad22',
          image: '',
          is_hidden: false,
          is_deleted: false,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]),
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('pop_ups', null, {});
  },
};
