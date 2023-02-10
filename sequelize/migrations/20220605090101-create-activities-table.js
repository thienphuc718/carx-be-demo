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
      'activities',
      {
        id: {
          primaryKey: true,
          type: Sequelize.DataTypes.UUID,
          defaultValue: Sequelize.DataTypes.UUIDV4,
        },
        entity_id: {
          type: Sequelize.DataTypes.UUID,
          allowNull: false,
        },
        code: {
          type: Sequelize.DataTypes.STRING,
          allowNull: false,
        },
        data: {
          type: Sequelize.DataTypes.JSONB,
        },
        entity_name: {
          type: Sequelize.DataTypes.STRING,
          allowNull: false,
        },
        user_id: {
          type: Sequelize.DataTypes.UUID,
          allowNull: false,
          references: {
            model: {
              tableName: 'users',
            },
            key: 'id',
          },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        },
        created_at: {
          type: Sequelize.DataTypes.DATE,
        },
        updated_at: {
          type: Sequelize.DataTypes.DATE,
        },
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
    return queryInterface.dropTable('activities');
  },
};
