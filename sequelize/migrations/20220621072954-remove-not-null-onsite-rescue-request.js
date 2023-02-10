'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.sequelize.query(`
      ALTER TABLE onsite_rescue_requests ALTER COLUMN agent_id drop not null;
      ALTER TABLE onsite_rescue_requests ALTER COLUMN booking_id drop not null;
    `);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.sequelize.query(`
     ALTER TABLE onsite_rescue_requests ALTER COLUMN agent_id set not null;
     ALTER TABLE onsite_rescue_requests ALTER COLUMN booking_id set not null;
   `);
  },
};
