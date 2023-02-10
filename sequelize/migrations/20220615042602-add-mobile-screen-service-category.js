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
      'service_categories',
      'mobile_screen',
      {
        type: Sequelize.DataTypes.STRING,
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
    return queryInterface.removeColumn('service_categories', 'mobile_screen', {
      schema: schemaConfig.name,
    });
  },
};
