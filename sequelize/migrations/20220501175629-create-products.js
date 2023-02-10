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
     queryInterface.createTable('products', {
       id: {
         allowNull: false,
         primaryKey: true,
         type: Sequelize.DataTypes.UUID,
         defaultValue: Sequelize.DataTypes.UUIDV4
       },
       name: {
         type: Sequelize.DataTypes.STRING,
       },
       is_variable: {
         type: Sequelize.DataTypes.BOOLEAN,
         defaultValue: false
       },
       is_guaranteed: {
         type: Sequelize.DataTypes.BOOLEAN,
         defaultValue: false
       },
       guarantee_time: {
         type: Sequelize.DataTypes.INTEGER,
       },
       currency_unit: {
         type: Sequelize.DataTypes.ENUM('VND', 'USD'),
         defaultValue: 'VND'
       },
       brand_id: {
         type: Sequelize.DataTypes.UUID,
         references: {
           model: {
             tableName: 'product_brands',
           },
           key: 'id',
         },
         onDelete: 'cascade',
         onUpdate: 'cascade',
       },
       guarantee_time_unit: {
         type: Sequelize.DataTypes.ENUM('DAY', 'WEEK', 'MONTH', 'YEAR'),
         defaultValue: 'DAY'
       },
       type: {
         type: Sequelize.DataTypes.ENUM('PHYSICAL', 'SERVICE'),
         defaultValue: 'PHYSICAL'
       },
       status: {
         type: Sequelize.DataTypes.ENUM('ACTIVE', 'DEACTIVE', 'OUT_OF_STOCK'),
         defaultValue: 'ACTIVE'
       },
       description: {
         type: Sequelize.DataTypes.STRING,
       },
       slug: {
         type: Sequelize.DataTypes.STRING,
         defaultValue: 0
       },
       note: {
         type: Sequelize.DataTypes.TEXT,
         defaultValue: 0
       },
       other_info: {
         type: Sequelize.DataTypes.ARRAY(Sequelize.DataTypes.JSONB),
       },
       tags: {
         type: Sequelize.DataTypes.ARRAY(Sequelize.DataTypes.STRING),
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
     queryInterface.dropTable('products', { schema: schemaConfig.name })
  }
};
