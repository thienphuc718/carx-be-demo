'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return Promise.all([
      await queryInterface.removeColumn('deals', 'agent_id'),
      await queryInterface.addColumn('deals', 'product_id', {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'products',
          },
          key: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
      await queryInterface.addColumn('deals', 'is_hot_deal', {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return Promise.all([
      await queryInterface.removeColumn('deals', 'product_id'),
      await queryInterface.removeColumn('deals', 'is_hot_deal'),
    ]);
  },
};
