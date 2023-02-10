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
      await queryInterface.addColumn('products', 'agent_category_id', {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'agent_categories',
          },
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      }),

      await queryInterface.addColumn('services', 'agent_category_id', {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'agent_categories',
          },
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      }),
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
      await queryInterface.removeColumn('products', 'agent_category_id'),
      await queryInterface.removeColumn('services', 'agent_category_id'),
    ]);
  }
};
