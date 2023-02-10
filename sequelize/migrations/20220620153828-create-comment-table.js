'use strict';
const schemaConfig = require(__dirname + '../../config/schema.js');

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.createTable('comments', {
      id: {
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4
      },
      user_id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        references: {
          model: {
            tableName: 'users',
          },
          key: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
      content: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      comment_id: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'comments',
          },
          key: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
      post_id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        references: {
          model: {
            tableName: 'posts',
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
    }, {
      schema: schemaConfig.name
    })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.dropTable('comments', {
      schema: schemaConfig.name
    })
  }
};
