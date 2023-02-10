'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     return Promise.all([
      await queryInterface.addColumn('agents', 'total_orders', {
        type: Sequelize.DataTypes.BIGINT,
      }),
      await queryInterface.addColumn('agents', 'total_revenue', {
        type: Sequelize.DataTypes.BIGINT,
      })
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return Promise.all([
      queryInterface.removeColumn('agents', 'total_orders'),
      queryInterface.removeColumn('agents', 'total_revenue'),
    ]);
  }
};
