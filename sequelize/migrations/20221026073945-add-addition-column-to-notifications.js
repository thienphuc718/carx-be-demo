'use strict';
let tableName = 'notifications';
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.addColumn(tableName, 'push_title', {
        type: Sequelize.DataTypes.STRING,
      }, {transaction: t});
      await queryInterface.addColumn(tableName, 'push_message', {
        type: Sequelize.DataTypes.STRING,
      }, {transaction: t});
      await queryInterface.addColumn(tableName, 'vendor_response', {
        type: Sequelize.DataTypes.JSONB,
      }, {transaction: t});
      await queryInterface.renameColumn(tableName, 'content', 'message', {transaction: t});
      await queryInterface.addColumn(tableName, 'content', {
        type: Sequelize.DataTypes.TEXT,
      }, {transaction: t});
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeColumn(tableName, 'push_title', {transaction: t});
      await queryInterface.removeColumn(tableName, 'push_message', {transaction: t});
      await queryInterface.removeColumn(tableName, 'vendor_response', {transaction: t});
      await queryInterface.removeColumn(tableName, 'content', {transaction: t});
      await queryInterface.renameColumn(tableName, 'message', 'content', {transaction: t});
    })
  }
};
