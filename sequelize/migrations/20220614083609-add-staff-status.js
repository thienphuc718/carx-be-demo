'use strict';
const schemaConfig = require(__dirname + '../../config/schema.js');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'staffs',
      'status',
      {
        type: Sequelize.DataTypes.STRING,
        defaultValue: 'ACTIVE',
      },
      { schema: schemaConfig.name },
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('staffs', 'status', {
      schema: schemaConfig.name,
    });
  },
};
