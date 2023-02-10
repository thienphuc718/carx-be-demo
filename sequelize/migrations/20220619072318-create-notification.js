'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.createTable('notifications', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.DataTypes.UUIDV4,
      },
      image: {
        type: Sequelize.DataTypes.STRING,
      },
      content: {
        type: Sequelize.DataTypes.STRING,
      },
      data: {
        type: Sequelize.DataTypes.JSONB,
      },
      user_id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: true,
        references: {
          model: {
            tableName: 'users',
          },
          key: 'id',
        },
        onDelete: 'set null',
        onUpdate: 'cascade',
      },
      type: {
        type: Sequelize.DataTypes.ENUM(
          'CARX',
          'AGENT_CONFIRM_ORDER',
          'AGENT_CANCEL_ORDER',
          'AGENT_CONFIRM_BOOKING',
          'AGENT_CANCEL_BOOKING',
          'AGENT_RESPONSE_FLASH_BUY_REQUEST',
          'AGENT_RESPONSE_RESCUE_REQUEST',
          'AGENT_SEND_QUOTATION',
          'ORDER_DELIVERING',
          'ORDER_COMPLETED',
          'BOOKING_COMPLETED',
          'BOOKING_WAITING_FOR_PAYMENT',
          'CUSTOMER_CREATE_ORDER',
          'CUSTOMER_CANCEL_ORDER',
          'CUSTOMER_CREATE_BOOKING',
          'CUSTOMER_CANCEL_BOOKING',
          'CUSTOMER_CREATE_FLASH_BUY_REQUEST',
          'CUSTOMER_CREATE_RESCUE_REQUEST',
          'CUSTOMER_ACCEPT_FLASH_BUY_RESPONSE',
          'CUSTOMER_REPORT_ORDER',
          'CUSTOMER_REPORT_BOOKING',
          'CUSTOMER_CONFIRM_QUOTATION',
          'CUSTOMER_REVIEW_ORDER',
          'CUSTOMER_REVIEW_BOOKING',
          'NEW_MESSAGE',
          'USER_LIKE_POST',
          'USER_COMMENT_POST',
          'UPCOMING_BOOKING',
        ),
        defaultValue: 'CARX',
      },
      is_deleted: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_read: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
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
    return queryInterface.dropTable('notifications');
  },
};
