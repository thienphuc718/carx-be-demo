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
      await queryInterface.addColumn('orders', 'order_no', {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true
      }),

      await queryInterface.addColumn('bookings', 'booking_no', {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true
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
      await queryInterface.removeColumn('orders', 'order_no'),
      await queryInterface.removeColumn('bookings', 'booking_no')
    ])
  }
};
