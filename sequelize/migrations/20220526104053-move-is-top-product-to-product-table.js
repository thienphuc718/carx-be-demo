'use strict';
const schemaConfig = require(__dirname + '../../config/schema.js');
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return Promise.all([
      await queryInterface.removeColumn('product_variants', 'is_top_product', {
        schema: schemaConfig.name,
      }),
      await queryInterface.addColumn(
        'products',
        'is_top_product',
        {
          type: Sequelize.DataTypes.BOOLEAN,
          defaultValue: false,
        },
        { schema: schemaConfig.name },
      ),
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return Promise.all([
      await queryInterface.removeColumn('product', 'is_top_product', {
        schema: schemaConfig.name,
      }),
      await queryInterface.addColumn(
        'product_variants',
        'is_top_product',
        {
          type: Sequelize.DataTypes.BOOLEAN,
          defaultValue: false,
        },
        { schema: schemaConfig.name },
      ),
    ]);
  },
};
