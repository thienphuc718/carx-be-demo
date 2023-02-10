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
      await queryInterface.addColumn('orders', 'invoice_image', {
        type: Sequelize.DataTypes.STRING,
      }),
      await queryInterface.addColumn('bookings', 'invoice_image', {
        type: Sequelize.DataTypes.STRING,
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
      await queryInterface.removeColumn('orders', 'invoice_image'),
      await queryInterface.removeColumn('bookings', 'invoice_image'),
    ]);
  },
};
