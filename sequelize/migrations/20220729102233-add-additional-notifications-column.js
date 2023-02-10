'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return Promise.all([
      await queryInterface.addColumn('notifications', 'target_group', {
        type: Sequelize.DataTypes.STRING,
      }),

      await queryInterface.addColumn('notifications', 'set_day', {
        type: Sequelize.DataTypes.STRING,
      }),

      await queryInterface.addColumn('notifications', 'set_time', {
        type: Sequelize.DataTypes.STRING,
      }),

      await queryInterface.addColumn('notifications', 'sending_type', {
        type: Sequelize.DataTypes.STRING,
        defaultValue: 'INSTANTLY'
      })
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return Promise.all([
      await queryInterface.addColumn('notifications', 'target_group'),
      await queryInterface.addColumn('notifications', 'set_day'),
      await queryInterface.addColumn('notifications', 'set_time'),
      await queryInterface.addColumn('notifications', 'sending_type'),
    ])
  }
};
