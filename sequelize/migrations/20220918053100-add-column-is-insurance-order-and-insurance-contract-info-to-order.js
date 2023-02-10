'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.sequelize.transaction(async t => {
      await queryInterface.addColumn('orders', 'is_insurance_order', {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
      }, { transaction: t });
      await queryInterface.addColumn('orders', 'insurance_info', {
        type: Sequelize.DataTypes.JSONB,
      }, { transaction: t })
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.sequelize.transaction(async t => {
      await queryInterface.removeColumn('orders', 'is_insurance_order', { transaction: t });
      await queryInterface.removeColumn('orders', 'insurance_info', { transaction: t });
    });
  }
};
