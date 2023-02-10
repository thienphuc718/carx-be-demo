'use strict';
const schemaConfig = require(__dirname + '../../config/schema.js');
module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'bookings',
        'completed_date',
        {
          type: Sequelize.DataTypes.DATE,
        },
        { schema: schemaConfig.name },
      ),
      queryInterface.addColumn(
        'bookings',
        'completed_hour',
        {
          type: Sequelize.DataTypes.STRING,
        },
        { schema: schemaConfig.name },
      ),
    ]);
  },

  down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('bookings', 'completed_date', {
        schema: schemaConfig.name,
      }),
      queryInterface.removeColumn('bookings', 'completed_hour', {
        schema: schemaConfig.name,
      }),
    ]);
  },
};
