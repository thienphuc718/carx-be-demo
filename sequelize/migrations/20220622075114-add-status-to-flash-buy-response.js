'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.addColumn(
      'flash_buy_requests_agent_relations',
      'status',
      {
        type: Sequelize.DataTypes.ENUM('ACCEPTED', 'REJECTED'),
        defaultValue: 'ACCEPTED',
      },
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.removeColumn(
      'flash_buy_requests_agent_relations',
      'status',
    );
  },
};
