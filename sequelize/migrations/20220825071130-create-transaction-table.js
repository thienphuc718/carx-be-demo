'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.createTable('transactions', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.DataTypes.UUIDV4,
      },
      order_id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        references: {
          model: {
            tableName: 'orders',
          },
          key: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
      customer_id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        references: {
          model: {
            tableName: 'customers',
          },
          key: 'id',
        },
        onDelete: 'set null',
        onUpdate: 'cascade',
      },
      agent_id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        references: {
          model: {
            tableName: 'agents',
          },
          key: 'id',
        },
        onDelete: 'set null',
        onUpdate: 'cascade',
      },
      status: {
        type: Sequelize.DataTypes.STRING,
        defaultValue: 'PENDING',
      },
      payment_method: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      payment_type: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      payment_provider_response_data: {
        type: Sequelize.DataTypes.JSONB,
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
    return queryInterface.dropTable('transactions');
  },
};
