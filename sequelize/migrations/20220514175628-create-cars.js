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
     queryInterface.createTable('cars', {
       id: {
         allowNull: false,
         primaryKey: true,
         type: Sequelize.DataTypes.UUID,
         defaultValue: Sequelize.DataTypes.UUIDV4
       },
       customer_id: {
         allowNull: false,
         type: Sequelize.DataTypes.UUID,
         references: {
           model: {
             tableName: 'customers',
           },
           key: 'id',
         },
         onDelete: 'cascade',
         onUpdate: 'cascade',
       },
       brand: {
         type: Sequelize.DataTypes.STRING,
       },
       model_name: {
         type: Sequelize.DataTypes.STRING,
       },
       model_number: {
         type: Sequelize.DataTypes.STRING,
       },
       car_no: {
         type: Sequelize.DataTypes.STRING,
       },
       color: {
         type: Sequelize.DataTypes.STRING,
       },
       tire_no: {
         type: Sequelize.DataTypes.STRING,
       },
       vin_no: {
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
     queryInterface.dropTable('cars', { schema: schemaConfig.name })
  }
};
