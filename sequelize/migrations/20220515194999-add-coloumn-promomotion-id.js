'use strict';
const schemaConfig = require(__dirname + '../../config/schema.js');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('orders', 'agent_promotion_code', {
        type: Sequelize.DataTypes.STRING
      }, { schema: schemaConfig.name }),
      queryInterface.addColumn('orders', 'transportation_method', {
        type: Sequelize.DataTypes.STRING
      }, { schema: schemaConfig.name }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('orders', 'agent_promotion_code', {
        schema: schemaConfig.name
      }),
      queryInterface.removeColumn('orders', 'transportation_method', {
        schema: schemaConfig.name
      })
    ]);
  },
};
