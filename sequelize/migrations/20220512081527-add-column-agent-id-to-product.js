'use strict';
const schemaConfig = require(__dirname + '../../config/schema.js');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await Promise.all([
      queryInterface.addColumn(
        'products',
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
        },
        { schema: schemaConfig.name },
      ),
      queryInterface.addColumn(
        'services',
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
        },
        { schema: schemaConfig.name },
      ),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('products', 'agent_id', {
        schema: schemaConfig.name,
      }),
      queryInterface.removeColumn('services', 'agent_id', {
        schema: schemaConfig.name,
      }),
    ]);
  },
};
