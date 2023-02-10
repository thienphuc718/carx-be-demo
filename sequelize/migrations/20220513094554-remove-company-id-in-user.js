'use strict';
const schemaConfig = require(__dirname + '../../config/schema.js');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('users', 'company_id', {
      schema: schemaConfig.name,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'users',
      'company_id',
      {
        type: Sequelize.DataTypes.UUID,
        allowNull: true,
        references: {
          model: {
            tableName: 'companies',
          },
          key: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
      { schema: schemaConfig.name },
    );
  },
};
