'use strict';
const schemaConfig = require(__dirname + '../../config/schema.js');
module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'order_items',
      'is_incurring',
      {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
      },
      { schema: schemaConfig.name },
    );
  },

  down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('order_items', 'is_incurring', {
      schema: schemaConfig.name,
    });
  },
};
