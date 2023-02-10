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
    return queryInterface.createTable('promotions', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
      },
      code: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.DataTypes.STRING,
      },
      discount_type: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      total_used: {
        type: Sequelize.DataTypes.INTEGER,
        defaultValue: 0,
      },
      quantity: {
        type: Sequelize.DataTypes.INTEGER,
        defaultValue: 0,
      },
      gift_id: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'gifts'
          },
          key: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      value: {
        type: Sequelize.DataTypes.FLOAT,
        allowNull: false,
      },
      start_date: {
        type: Sequelize.DataTypes.DATE,
      },
      end_date: {
        type: Sequelize.DataTypes.DATE,
      },
      is_applied_all: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false
      },
      is_deleted: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
      },
      min_value: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
      },
      max_value: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DataTypes.DATE,
      },
      updated_at: {
        type: Sequelize.DataTypes.DATE,
      }
    }, {
      schema: schemaConfig.name
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.dropTable('promotions')
  }
};
