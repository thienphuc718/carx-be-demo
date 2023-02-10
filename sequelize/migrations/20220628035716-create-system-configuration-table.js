'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.createTable('system_configurations', {
      id: {
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
      },
      name: {
        type: Sequelize.DataTypes.STRING,
      },
      apply_value: {
        type: Sequelize.DataTypes.INTEGER,
      },
      apply_unit: {
        type: Sequelize.DataTypes.STRING,
      },
      compare_value: {
        type: Sequelize.DataTypes.INTEGER,
      },
      compare_unit: {
        type: Sequelize.DataTypes.STRING,
      },
      is_enabled: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: true,
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
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.dropTable('system_configurations');
  },
};
