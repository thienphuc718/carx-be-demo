'use strict';
const schemaConfig = require(__dirname + '../../config/schema.js');
module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'orders',
      'cancel_reason',
      {
        type: Sequelize.DataTypes.STRING,
      },
      { schema: schemaConfig.name },
    );
  },

  down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('orders', 'cancel_reason', {
      schema: schemaConfig.name,
    });
  },
};
