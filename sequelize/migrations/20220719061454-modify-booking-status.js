'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.sequelize.query(
      `
       alter type "enum_bookings_status" add value 'QUOTATION_SENT';
       alter type "enum_bookings_status" add value 'QUOTATION_CONFIRMED';
      `,
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.sequelize.query(`
     create type "enum_bookings_status_new" as enum ('CREATED', 'CONFIRMED', 'PROCESSING', 'WAITING_FOR_PAYMENT', 'COMPLETED', 'CANCELLED', 'REPORTED');
     alter table "bookings" alter COLUMN "status" drop default;
     alter table "bookings" alter COLUMN "status" type "enum_bookings_status_new" using ("status"::text::"enum_bookings_status_new");
     drop type "enum_bookings_status";
     alter type "enum_bookings_status_new" rename to "enum_bookings_status";
     alter table "bookings" alter COLUMN "status"
     set default 'CREATED';
   `);
  },
};
