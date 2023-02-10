'use strict';
const schemaConfig = require(__dirname + '../../config/schema.js');
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.sequelize.query(
      `alter type "enum_orders_status" add value 'DELIVERING'`,
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
      create type "enum_orders_status_new" as enum ('CREATED', 'PROCESSING', 'COMPLETED', 'CANCELLED', 'PURCHASED');
      alter table "orders" alter COLUMN "status" drop default;
      alter table "orders" alter COLUMN "status" type "enum_orders_status_new" using ("status"::text::"enum_orders_status_new");
      drop type "enum_orders_status";
      alter type "enum_orders_status_new" rename to "enum_orders_status";
      alter table "orders" alter COLUMN "status"
      set default 'CREATED';
    `);
  },
};
