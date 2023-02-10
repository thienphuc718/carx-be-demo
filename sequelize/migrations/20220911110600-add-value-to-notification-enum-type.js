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
      await queryInterface.changeColumn('notifications', 'type', {
        type: Sequelize.DataTypes.STRING,
        defaultValue: 'CARX',
      }),
      await queryInterface.sequelize.query(`
        alter table "notifications" alter COLUMN "type" drop default;
        drop type "enum_notifications_type";
        alter table "notifications" alter COLUMN "type" set default 'CARX';
      `)
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.sequelize.query(`
     create type "enum_notifications_type" as enum ('CARX', 'AGENT_CONFIRM_ORDER', 'AGENT_CANCEL_ORDER', 'AGENT_CONFIRM_BOOKING', 'AGENT_CANCEL_BOOKING', 'AGENT_RESPONSE_FLASH_BUY_REQUEST', 'AGENT_RESPONSE_RESCUE_REQUEST', 'AGENT_SEND_QUOTATION', 'ORDER_DELIVERING', 'ORDER_COMPLETED', 'BOOKING_COMPLETED', 'BOOKING_WAITING_FOR_PAYMENT', 'CUSTOMER_CREATE_ORDER', 'CUSTOMER_CANCEL_ORDER', 'CUSTOMER_CREATE_BOOKING', 'CUSTOMER_CANCEL_BOOKING', 'CUSTOMER_CREATE_FLASH_BUY_REQUEST', 'CUSTOMER_CREATE_RESCUE_REQUEST', 'CUSTOMER_ACCEPT_FLASH_BUY_RESPONSE', 'CUSTOMER_REPORT_ORDER', 'CUSTOMER_REPORT_BOOKING', 'CUSTOMER_CONFIRM_QUOTATION', 'CUSTOMER_REVIEW_ORDER', 'CUSTOMER_REVIEW_BOOKING', 'NEW_MESSAGE', 'USER_LIKE_POST', 'USER_COMMENT_POST', 'UPCOMING_BOOKING');
     alter table "notifications" alter COLUMN "type" drop default;
     alter table "notifications" alter COLUMN "type" type "enum_notifications_type" using ("status"::text::"enum_notifications_type");
     alter table "notifications" alter COLUMN "type" set default 'CARX';
   `);
  }
};
