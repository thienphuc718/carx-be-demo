'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return Promise.all([
      await queryInterface.addColumn('trailer_rescue_requests', 'car_info', {
        type: Sequelize.DataTypes.JSONB,
      }),
      await queryInterface.addColumn('trailer_rescue_requests', 'customer_info', {
        type: Sequelize.DataTypes.JSONB,
      }),
      await queryInterface.addColumn('trailer_rescue_requests', 'is_deleted', {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return Promise.all([
      await queryInterface.removeColumn('trailer_rescue_requests', 'car_info'),
      await queryInterface.removeColumn('trailer_rescue_requests','customer_info'),
      await queryInterface.removeColumn('trailer_rescue_requests', 'is_deleted'),
    ]);
  },
};
