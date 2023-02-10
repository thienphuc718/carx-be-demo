'use strict';
const schemaConfig = require(__dirname + '../../config/schema.js');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'staffs',
      {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.DataTypes.UUID,
          defaultValue: Sequelize.DataTypes.UUIDV4,
        },
        user_id: {
          allowNull: false,
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

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('staffs');
  },
};
