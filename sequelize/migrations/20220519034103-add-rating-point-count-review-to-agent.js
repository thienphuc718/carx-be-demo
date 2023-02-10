'use strict';
const schemaConfig = require(__dirname + '../../config/schema.js');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'agents',
        'rating_points',
        {
          type: Sequelize.DataTypes.DECIMAL,
          defaultValue: 0,
        },
        { schema: schemaConfig.name },
      ),
      queryInterface.addColumn(
        'agents',
        'count_review',
        {
          type: Sequelize.DataTypes.INTEGER,
          defaultValue: 0,
        },
        { schema: schemaConfig.name },
      ),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('agents', 'rating_points', {
        schema: schemaConfig.name,
      }),
      queryInterface.removeColumn('agents', 'count_review', {
        schema: schemaConfig.name,
      }),
    ]);
  },
};
