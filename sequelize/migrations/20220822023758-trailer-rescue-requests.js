'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.createTable('trailer_rescue_requests', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.DataTypes.UUIDV4,
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
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
      former_status: {
        type: Sequelize.DataTypes.STRING,
        defaultValue: 'SENT',
      },
      later_status: {
        type: Sequelize.DataTypes.STRING,
        defaultValue: 'SENT',
      },
      former_agent_id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: true,
        references: {
          model: {
            tableName: 'agents',
          },
          key: 'id',
        },
        onDelete: 'set null',
        onUpdate: 'cascade',
      },
      later_agent_id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: true,
        references: {
          model: {
            tableName: 'agents',
          },
          key: 'id',
        },
        onDelete: 'set null',
        onUpdate: 'cascade',
      },
      former_booking_id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: true,
        references: {
          model: {
            tableName: 'bookings',
          },
          key: 'id',
        },
        onDelete: 'set null',
        onUpdate: 'cascade',
      },
      later_booking_id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: true,
        references: {
          model: {
            tableName: 'bookings',
          },
          key: 'id',
        },
        onDelete: 'set null',
        onUpdate: 'cascade',
      },
      rescue_reason: {
        type: Sequelize.DataTypes.STRING,
      },
      cancel_reason: {
        type: Sequelize.DataTypes.STRING,
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
    return queryInterface.dropTable('trailer_rescue_requests');
  },
};
