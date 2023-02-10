'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.addColumn('orders', 'status', {
      type: Sequelize.DataTypes.ENUM(
        'CREATED',
        'PROCESSING',
        'COMPLETED',
        'CANCELLED',
        'PURCHASED',
      ),
      defaultValue: 'CREATED',
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.removeColumn('orders', 'status');
  },
};
