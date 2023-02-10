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
        'agents',
        'top_agent',
        {
          type: Sequelize.DataTypes.BOOLEAN,
          defaultValue: false,
        },
        { schema: schemaConfig.name },
      ),
      await queryInterface.addColumn(
        'agents',
        'order',
        {
          type: Sequelize.DataTypes.INTEGER,
          unique: true,
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
      await queryInterface.removeColumn('agents', 'top_agent', {
        schema: schemaConfig.name,
      }),
      await queryInterface.removeColumn('agents', 'order', {
        schema: schemaConfig.name,
      }),
    ]);
  },
};
