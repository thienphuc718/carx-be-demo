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
    return queryInterface.createTable('promotion-applies', { 
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
        unique: true,
      },
      object_name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      object_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      promotion_id: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'promotions',
          },
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
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
      }
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
    return queryInterface.dropTable('promotion-applies')
  }
};
