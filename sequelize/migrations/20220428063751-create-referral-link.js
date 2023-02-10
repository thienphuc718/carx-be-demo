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
     return queryInterface.createTable('referral-links', { 
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
      },
      link: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      created_by: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'users',
            key: 'id'
          },
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
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
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.dropTable('referral-links');
  }
};
