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
     queryInterface.createTable('product_categories', {
       id: {
         allowNull: false,
         primaryKey: true,
         type: Sequelize.DataTypes.UUID,
         defaultValue: Sequelize.DataTypes.UUIDV4
       },
       parent_id: {
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
       name: {
         type: Sequelize.DataTypes.STRING,
       },
       slug: {
         type: Sequelize.DataTypes.STRING,
       },
       image: {
         type: Sequelize.DataTypes.STRING,
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
     queryInterface.dropTable('product_categories', { schema: schemaConfig.name })
  }
};
