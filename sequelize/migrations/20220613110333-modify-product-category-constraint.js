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
      await queryInterface.removeConstraint(
        'product_category_selecteds',
        'product_category_selecteds_category_id_fkey',
        {
          schema: schemaConfig.name,
        },
      ),

      await queryInterface.addConstraint(
        'product_category_selecteds',
        {
          fields: ['category_id'],
          type: 'foreign key',
          name: 'product_category_selecteds_category_id_fkey',
          references: {
            table: 'service_categories',
            field: 'id',
          },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        },
        {
          schema: schemaConfig.name,
        },
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
      await queryInterface.removeConstraint(
        'product_category_selecteds',
        'product_category_selecteds_category_id_fkey',
        {
          schema: schemaConfig.name,
        },
      ),

      await queryInterface.addConstraint(
        'product_category_selecteds',
        {
          fields: ['category_id'],
          type: 'foreign key',
          name: 'product_category_selecteds_category_id_fkey',
          references: {
            table: 'product_categories',
            field: 'id',
          },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        },
        {
          schema: schemaConfig.name,
        },
      ),
    ]);
  },
};
