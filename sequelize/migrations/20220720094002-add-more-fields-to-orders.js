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
      await queryInterface.addColumn('orders', 'initial_value', {
        type: Sequelize.DataTypes.DOUBLE,
        defaultValue: 0,
      }),

      await queryInterface.addColumn('orders', 'vat_value_applied', {
        type: Sequelize.DataTypes.DOUBLE,
        defaultValue: 0,
      }),

      await queryInterface.addColumn('orders', 'promotion_value_applied', {
        type: Sequelize.DataTypes.FLOAT,
        defaultValue: 0,
      }),

      await queryInterface.addColumn('orders', 'point_value_applied', {
        type: Sequelize.DataTypes.DOUBLE,
        defaultValue: 0,
      }),

      await queryInterface.addColumn('orders', 'point_used', {
        type: Sequelize.DataTypes.INTEGER,
        defaultValue: 0,
      }),
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
      await queryInterface.removeColumn('orders', 'initial_value'),
      await queryInterface.removeColumn('orders', 'vat_value_applied'),
      await queryInterface.removeColumn('orders', 'promotion_value_applied'),
      await queryInterface.removeColumn('orders', 'point_value_applied'),
      await queryInterface.removeColumn('orders', 'point_used'),
    ])
  }
};
