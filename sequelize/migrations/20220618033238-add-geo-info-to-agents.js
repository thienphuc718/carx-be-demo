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
       await queryInterface.addColumn('agents', 'geo_info', {
         type: Sequelize.DataTypes.JSON,
       }),
       await queryInterface.addColumn('agents', 'longitude', {
         type: Sequelize.DataTypes.DOUBLE,
       }),
       await queryInterface.addColumn('agents', 'latitude', {
         type: Sequelize.DataTypes.DOUBLE,
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
       queryInterface.removeColumn('agents', 'geo_info'),
       queryInterface.removeColumn('agents', 'longitude'),
       queryInterface.removeColumn('agents', 'latitude'),
     ]);
  }
};
