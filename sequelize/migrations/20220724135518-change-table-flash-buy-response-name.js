'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.renameTable(
      'flash_buy_requests_agent_relations',
      'flash_buy_responses',
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.renameTable(
      'flash_buy_responses',
      'flash_buy_requests_agent_relations',
    );
  },
};
