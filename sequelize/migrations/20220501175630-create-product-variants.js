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
     queryInterface.createTable('product_variants', {
       id: {
         allowNull: false,
         primaryKey: true,
         type: Sequelize.DataTypes.UUID,
         defaultValue: Sequelize.DataTypes.UUIDV4
       },
       images: {
         type: Sequelize.DataTypes.ARRAY(Sequelize.DataTypes.STRING),
       },
       price: {
         type: Sequelize.DataTypes.DOUBLE,
       },
       discount_price: {
         type: Sequelize.DataTypes.DOUBLE,
       },
       quantity: {
         type: Sequelize.DataTypes.INTEGER,
         defaultValue: 0
       },
       sku: {
         type: Sequelize.DataTypes.STRING,
       },
       product_id: {
         allowNull: false,
         type: Sequelize.DataTypes.UUID,
         references: {
           model: {
             tableName: 'products',
           },
           key: 'id',
         },
         onDelete: 'cascade',
         onUpdate: 'cascade',
       },
       value: {
         type: Sequelize.DataTypes.ARRAY(Sequelize.DataTypes.JSONB),
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
     queryInterface.dropTable('product_variants', { schema: schemaConfig.name })
  }
};
