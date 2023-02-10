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
    return Promise.all([
      await queryInterface.addColumn(
        'service_categories',
        'show_on_homepage',
        {
          type: Sequelize.DataTypes.BOOLEAN,
          defaultValue: false,
        },
        { schema: schemaConfig.name },
      ),

      await queryInterface.addColumn('service_categories', 'order', {
        type: Sequelize.DataTypes.INTEGER,
        unique: true,
      }),

      await queryInterface.addColumn(
        'service_categories',
        'image',
        {
          type: Sequelize.DataTypes.STRING,
        },
        { schema: schemaConfig.name },
      ),
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
      await queryInterface.removeColumn(
        'service_categories',
        'show_on_homepage',
        { schema: schemaConfig.name },
      ),

      await queryInterface.removeColumn('service_categories', 'order', {
        schema: schemaConfig.name,
      }),

      await queryInterface.removeColumn('service_categories', 'image', {
        schema: schemaConfig.name,
      }),
    ]);
  },
};
