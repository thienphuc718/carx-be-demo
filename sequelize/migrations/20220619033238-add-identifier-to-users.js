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
       await queryInterface.addColumn('users', 'identifier', {
         type: Sequelize.DataTypes.JSON,
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
       queryInterface.removeColumn('users', 'identifier'),
     ]);
  }
};
