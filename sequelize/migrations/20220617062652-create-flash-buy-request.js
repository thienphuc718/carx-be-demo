'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.createTable('flash_buy_requests', {
      id: {
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
      },
      product_name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      product_description: {
        type: Sequelize.DataTypes.STRING,
      },
      // product_color: {
      //   type: Sequelize.DataTypes.STRING,
      // },
      product_image: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      is_deleted: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_done: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
      },
      customer_id: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'customers',
          },
          key: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
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
    return queryInterface.dropTable('flash_buy_requests');
  },
};
