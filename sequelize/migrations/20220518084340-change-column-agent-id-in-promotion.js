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
      await queryInterface.removeColumn('promotions', 'agent_id', {
        schema: schemaConfig.name,
      }),
      await queryInterface.addColumn(
        'promotions',
        'agent_id',
        {
          type: Sequelize.DataTypes.UUID,
          references: {
            model: {
              tableName: 'agents',
            },
            key: 'id',
          },
          onDelete: 'cascade',
          onUpdate: 'cascade',
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
      await queryInterface.removeColumn('promotions', 'agent_id', {
        schema: schemaConfig.name,
      }),
      await queryInterface.addColumn(
        'promotions',
        'agent_id',
        {
          type: Sequelize.DataTypes.UUID,
          references: {
            model: {
              tableName: 'users',
            },
            key: 'id',
          },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        },
        { schema: schemaConfig.name },
      ),
    ]);
  },
};
