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
      await queryInterface.changeColumn('promotions', 'min_value', {
        type: Sequelize.DataTypes.BIGINT,
      }),

      await queryInterface.changeColumn('promotions', 'max_value', {
        type: Sequelize.DataTypes.BIGINT,
      }),
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return Promise.all([
      await queryInterface.changeColumn('promotions', 'min_value', {
        type: Sequelize.DataTypes.INTEGER,
      }),

      await queryInterface.changeColumn('promotions', 'max_value', {
        type: Sequelize.DataTypes.INTEGER,
      }),
    ])
  }
};
