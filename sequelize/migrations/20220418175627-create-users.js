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
     queryInterface.createTable('users', {
       id: {
         allowNull: false,
         primaryKey: true,
         type: Sequelize.DataTypes.UUID,
         defaultValue: Sequelize.DataTypes.UUIDV4
       },
       email: {
         type: Sequelize.DataTypes.STRING,
         allowNull: false,
       },
       phone_number: {
         type: Sequelize.DataTypes.STRING,
       },
       password: {
         type: Sequelize.DataTypes.STRING,
       },
       token: {
         type: Sequelize.DataTypes.TEXT,
         allowNull: false,
       },
       method: {
         type: Sequelize.DataTypes.STRING,
         allowNull: false,
       },
       otp: {
         type: Sequelize.DataTypes.STRING,
       },
       country_code: {
         type: Sequelize.DataTypes.STRING,
       },
       city: {
         type: Sequelize.DataTypes.STRING,
       },
       first_name: {
         type: Sequelize.DataTypes.STRING,
       },
       last_name: {
         type: Sequelize.DataTypes.STRING,
       },
       full_name: {
         type: Sequelize.DataTypes.STRING,
       },
       avatar: {
         type: Sequelize.DataTypes.STRING,
       },
       cover: {
         type: Sequelize.DataTypes.STRING,
       },
       address: {
         type: Sequelize.DataTypes.TEXT,
       },
       schema: {
         type: Sequelize.DataTypes.STRING,
       },

       role_id: {
         type: Sequelize.DataTypes.UUID,
         allowNull: true
       },

       company_id: {
         type: Sequelize.DataTypes.UUID,
         allowNull: true,
         references: {
           model: {
             tableName: 'companies',
           },
           key: 'id',
         },
         onDelete: 'cascade',
         onUpdate: 'cascade',
       },

       is_banned: {
         type: Sequelize.DataTypes.BOOLEAN,
         defaultValue: false
       },

       is_verified: {
         type: Sequelize.DataTypes.BOOLEAN,
         defaultValue: false
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
     queryInterface.dropTable('users', { schema: schemaConfig.name });
  }
};
