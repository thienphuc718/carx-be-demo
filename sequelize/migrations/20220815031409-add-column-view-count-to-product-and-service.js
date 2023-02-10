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
      await queryInterface.addColumn('products', 'view_count', {
        type: Sequelize.DataTypes.BIGINT,
        defaultValue: 0,
      }),
      await queryInterface.addColumn('services', 'view_count', {
        type: Sequelize.DataTypes.BIGINT,
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
      await queryInterface.removeColumn('products', 'view_count'),
      await queryInterface.removeColumn('services', 'view_count'),
    ]);
  }
};
