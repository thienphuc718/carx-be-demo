'use strict';
const schemaConfig = require(__dirname + '../../config/schema.js');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('promotions', 'name', {
        type: Sequelize.DataTypes.TEXT
      }, { schema: schemaConfig.name }),
      queryInterface.addColumn('promotions', 'agent_id', {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'users',
          },
          key: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }, { schema: schemaConfig.name })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('promotions', 'name', {
        schema: schemaConfig.name
      }),
      queryInterface.removeColumn('promotions', 'agent_id', {
        schema: schemaConfig.name
      })
    ]);
  },
};
