'use strict';
const schemaConfig = require(__dirname + '../../config/schema.js');

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable(
      'role_feature_relations',
      {
        role_id: {
          type: Sequelize.DataTypes.UUID,
          references: {
            model: {
              tableName: 'roles',
            },
            key: 'id',
          },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        },
        feature_id: {
          type: Sequelize.DataTypes.UUID,
          references: {
            model: {
              tableName: 'features',
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
        },
      },
      {
        schema: schemaConfig.name,
      },
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('role_feature_relationships', {
      schema: schemaConfig.name,
    });
  },
};
