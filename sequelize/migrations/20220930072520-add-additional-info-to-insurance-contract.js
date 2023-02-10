'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.sequelize.transaction(async t => {
      await queryInterface.addColumn('insurance_contracts', 'car_type_code', {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      }, { transaction: t });
      await queryInterface.addColumn('insurance_contracts', 'usage_code', {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      }, { transaction: t });
      await queryInterface.addColumn('insurance_contracts', 'insurance_amount', {
        type: Sequelize.DataTypes.DOUBLE,
        allowNull: false,
      }, { transaction: t });
      await queryInterface.addColumn('insurance_contracts', 'voluntary_insurance_amount', {
        type: Sequelize.DataTypes.DOUBLE,
      }, { transaction: t });
      await queryInterface.addColumn('insurance_contracts', 'capacity', {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      }, { transaction: t });
      await queryInterface.addColumn('insurance_contracts', 'price', {
        type: Sequelize.DataTypes.DOUBLE,
        allowNull: false,
      }, { transaction: t });
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.sequelize.transaction(async t => {
      await queryInterface.removeColumn('insurance_contracts', 'car_type_code', { transaction: t });
      await queryInterface.removeColumn('insurance_contracts', 'usage_code', { transaction: t });
      await queryInterface.removeColumn('insurance_contracts', 'capacity', { transaction: t });
      await queryInterface.removeColumn('insurance_contracts', 'insurance_amount', { transaction: t });
      await queryInterface.removeColumn('insurance_contracts', 'voluntary_insurance_amount', { transaction: t });
      await queryInterface.removeColumn('insurance_contracts', 'price', { transaction: t });
    })
  }
};
