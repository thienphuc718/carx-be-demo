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
      'orders',
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
        // allowNull: false,
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
    return queryInterface.removeColumn('orders', 'agent_id', {
      schema: schemaConfig.name,
    });
  },
};
