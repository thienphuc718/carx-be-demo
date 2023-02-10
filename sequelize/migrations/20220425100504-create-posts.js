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
      'posts',
      {
        id: {
          primaryKey: true,
          type: Sequelize.DataTypes.UUID,
          defaultValue: Sequelize.DataTypes.UUIDV4,
        },
        title: {
          type: Sequelize.DataTypes.STRING,
          allowNull: false,
        },
        slug: {
          type: Sequelize.DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: Sequelize.DataTypes.TEXT,
          allowNull: true,
        },
        content: {
          type: Sequelize.DataTypes.TEXT,
          allowNull: false,
        },
        thumbnail: {
          type: Sequelize.DataTypes.STRING,
          allowNull: true,
        },
        meta_tag_value: {
          type: Sequelize.DataTypes.ARRAY(Sequelize.DataTypes.STRING),
          allowNull: true,
        },
        schema_value: {
          type: Sequelize.DataTypes.STRING,
          allowNull: true,
        },
        visibility: {
          type: Sequelize.DataTypes.INTEGER,
          defaultValue: 1,
        },
        external_link: {
          type: Sequelize.DataTypes.STRING,
          allowNull: true,
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
    return queryInterface.dropTable('posts');
  },
};
