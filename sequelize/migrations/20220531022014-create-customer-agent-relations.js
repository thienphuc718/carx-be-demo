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
    return queryInterface.createTable(
      'customer_agent_relations',
      {
        customer_id: {
          type: Sequelize.DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
          references: {
            model: {
              tableName: 'customers',
            },
            key: 'id',
          },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        },
        agent_id: {
          type: Sequelize.DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
          references: {
            model: {
              tableName: 'agents',
            },
            key: 'id',
          },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        },
        is_deleted: {
          type: Sequelize.DataTypes.BOOLEAN,
          defaultValue: false,
        },
        created_at: {
          type: Sequelize.DataTypes.DATE,
        },
        updated_at: {
          type: Sequelize.DataTypes.DATE,
        }
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
    return queryInterface.dropTable('customer_agent_relations', {
      schema: schemaConfig.name,
    });
  },
};
