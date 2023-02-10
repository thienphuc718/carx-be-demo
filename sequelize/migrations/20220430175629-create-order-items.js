'use strict';
const schemaConfig = require(__dirname + '../../config/schema.js');

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     queryInterface.createTable('order_items', {
       id: {
         allowNull: false,
         primaryKey: true,
         type: Sequelize.DataTypes.UUID,
         defaultValue: Sequelize.DataTypes.UUIDV4
       },
       order_id: {
         allowNull: false,
         type: Sequelize.DataTypes.UUID,
         references: {
           model: {
             tableName: 'orders'
           },
           key: 'id',
         },
         onDelete: 'cascade',
         onUpdate: 'cascade',
       },
       product_sku: {
         type: Sequelize.DataTypes.STRING,
       },
       quantity: {
         type: Sequelize.DataTypes.INTEGER,
         defaultValue: 0
       },
       price: {
         type: Sequelize.DataTypes.DOUBLE,
         defaultValue: 0
       },
       is_deleted: {
         type: Sequelize.DataTypes.BOOLEAN,
         defaultValue: false
       },
       created_at: {
         type: Sequelize.DataTypes.DATE,
       },
       updated_at: {
         type: Sequelize.DataTypes.DATE,
       }
     }, { schema: schemaConfig.name })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     queryInterface.dropTable('order_items', { schema: schemaConfig.name })
  }
};
