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
    return queryInterface.createTable(
      'posts_categories_selecteds',
      {
        // id: {
        //   allowNull: false,
        //   primaryKey: true,
        //   type: Sequelize.DataTypes.UUID,
        //   defaultValue: Sequelize.DataTypes.UUIDV4,
        // },
        post_id: {
          type: Sequelize.DataTypes.UUID,
          references: {
            model: {
              tableName: 'posts',
            },
            key: 'id',
          },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        },
        category_id: {
          type: Sequelize.DataTypes.UUID,
          references: {
            model: {
              tableName: 'post_categories',
            },
            key: 'id',
          },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        },
      },
      {
        schema: schemaConfig.name,
      },
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.dropTable('posts_categories_selecteds');
  },
};
