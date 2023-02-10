'use strict';
const schemaConfig = require(__dirname + '../../config/schema.js');

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable(
      'service_templates',
      {
        id: {
          primaryKey: true,
          type: Sequelize.DataTypes.UUID,
          defaultValue: Sequelize.DataTypes.UUIDV4,
        },
        category_id: {
          allowNull: false,
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
        template: {
          type: Sequelize.DataTypes.STRING,
        },
        search: {
          type: Sequelize.DataTypes.ARRAY(Sequelize.DataTypes.TEXT),
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
    return queryInterface.dropTable('service_templates', {
      schema: schemaConfig.name,
    });
  },
};
