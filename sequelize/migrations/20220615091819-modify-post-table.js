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
      await queryInterface.addColumn('posts', 'user_id', {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        references: {
          model: {
            tableName: 'users',
          },
          key: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),

      await queryInterface.addColumn('posts', 'images', {
        type: Sequelize.DataTypes.ARRAY(Sequelize.DataTypes.STRING),
      }),

      await queryInterface.addColumn('posts', 'thumbnail', {
        type: Sequelize.DataTypes.STRING,
      }),

      await queryInterface.sequelize.query(
        `alter table posts alter column title drop not null`,
      ),

      await queryInterface.sequelize.query(
        `alter table posts alter column slug drop not null`,
      ),

      await queryInterface.removeColumn('posts', 'description'),

      await queryInterface.removeColumn('posts', 'visibility'),

      await queryInterface.addColumn('posts', 'visibility', {
        type: Sequelize.DataTypes.ENUM('PUBLIC', 'PRIVATE'),
        defaultValue: 'PUBLIC',
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
      await queryInterface.removeColumn('posts', 'images'),
      await queryInterface.removeColumn('posts', 'thumbnail'),
      await queryInterface.changeColumn('posts', 'description', {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      }),
    ]);
  },
};
