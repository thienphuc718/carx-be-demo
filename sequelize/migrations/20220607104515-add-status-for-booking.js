'use strict';
const schemaConfig = require(__dirname + '../../config/schema.js');

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.addColumn(
      'bookings',
      'status',
      {
        type: Sequelize.DataTypes.ENUM(
          'CREATED',
          'CONFIRMED',
          'PROCESSING',
          'WAITING_FOR_PAYMENT',
          'COMPLETED',
          'CANCELLED',
        ),
        defaultValue: 'CREATED',
      },
      {
        schema: schemaConfig.name,
      },
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.removeColumn('bookings', 'status', {
      schema: schemaConfig.name,
    });
  },
};
