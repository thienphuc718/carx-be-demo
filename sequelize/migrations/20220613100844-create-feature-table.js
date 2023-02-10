'use strict';
const schemaConfig = require(__dirname + '../../config/schema.js');

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable(
      'features',
      {
        id: {
          primaryKey: true,
          type: Sequelize.DataTypes.UUID,
          defaultValue: Sequelize.DataTypes.UUIDV4,
        },
        name: {
          type: Sequelize.DataTypes.STRING,
          allowNull: false,
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
    return queryInterface.dropTable('features', {
      schema: schemaConfig.name,
    });
  },
};
