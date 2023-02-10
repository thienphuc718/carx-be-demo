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
    return queryInterface.createTable('coin-configs', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
      },
      object_name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },  
      object_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      value: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
      },
      valid_date: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      is_deleted: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
      },
      created_at: {
        type: Sequelize.DataTypes.DATE,
      },
      updated_at: {
        type: Sequelize.DataTypes.DATE,
      },
    }, {
      schema: schemaConfig.name,
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.dropTable('coin-configs');
  }
};
