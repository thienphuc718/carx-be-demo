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
     queryInterface.createTable('product_category_selecteds', {
       // id: {
       //   allowNull: false,
       //   primaryKey: true,
       //   type: Sequelize.DataTypes.UUID,
       //   defaultValue: Sequelize.DataTypes.UUIDV4
       // },
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
       category_id: {
         allowNull: false,
         type: Sequelize.DataTypes.UUID,
         references: {
           model: {
             tableName: 'product_categories',
           },
           key: 'id',
         },
         onDelete: 'cascade',
         onUpdate: 'cascade',
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
     queryInterface.dropTable('product_category_selecteds', { schema: schemaConfig.name })
  }
};
