'use strict';
const schemaConfig = require(__dirname + '../../config/schema.js');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'companies',
      'email',
      { type: Sequelize.DataTypes.STRING },
      { schema: schemaConfig.name },
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('companies', 'email', {
      schema: schemaConfig.name,
    });
  },
};
