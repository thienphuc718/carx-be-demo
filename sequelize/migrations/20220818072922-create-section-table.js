'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.createTable('sections', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.DataTypes.UUIDV4,
      },
      name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      config: {
        type: Sequelize.DataTypes.JSONB,
        allowNull: false,
      },
      order: {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
      },
      is_enabled: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: true,
      },
      is_item_editable: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: true,
      },
      created_at: {
        type: Sequelize.DataTypes.DATE,
      },
      updated_at: {
        type: Sequelize.DataTypes.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
