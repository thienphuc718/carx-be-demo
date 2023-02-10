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
     queryInterface.createTable('companies', {
       id: {
         allowNull: false,
         primaryKey: true,
         type: Sequelize.DataTypes.UUID,
         defaultValue: Sequelize.DataTypes.UUIDV4
       },
       tax_id: {
         type: Sequelize.DataTypes.STRING,
       },
       name: {
         type: Sequelize.DataTypes.STRING,
       },
       address: {
         type: Sequelize.DataTypes.STRING,
       },
       phone_number: {
         type: Sequelize.DataTypes.STRING,
       },
       size: {
         type: Sequelize.DataTypes.STRING,
       },
       license: {
         type: Sequelize.DataTypes.ARRAY(Sequelize.DataTypes.STRING),
       },
       other_info: {
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
     queryInterface.dropTable('companies', { schema: schemaConfig.name })
  }
};
