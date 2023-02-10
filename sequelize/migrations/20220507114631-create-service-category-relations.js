'use strict';
const schemaConfig = require(__dirname + '../../config/schema.js');

module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.createTable(
      'service_category_relations',
      {
        service_id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.DataTypes.UUID,
          references: {
            model: {
              tableName: 'services',
            },
            key: 'id',
          },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        },
        category_id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.DataTypes.UUID,
          references: {
            model: {
              tableName: 'service_categories',
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
      { schema: schemaConfig.name },
    );
  },

  async down(queryInterface, Sequelize) {
    queryInterface.dropTable('service_category_relations', {
      schema: schemaConfig.name,
    });
  },
};
