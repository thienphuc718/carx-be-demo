'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.createTable('insurance_products', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.DataTypes.UUIDV4,
      },
      product_id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        references: {
          model: {
            tableName: 'products',
          },
          key: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
      usage_code: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      usage_reason: {
        type: Sequelize.DataTypes.STRING,
      },
      car_type_code: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      car_type: {
        type: Sequelize.DataTypes.STRING,
      },
      max_insurance_time: {
        type: Sequelize.DataTypes.INTEGER,
        defaultValue: 1,
      },
      insurance_time_unit: {
        type: Sequelize.DataTypes.STRING,
        defaultValue: 'YEAR',
      },
      tax_percentage: {
        type: Sequelize.DataTypes.INTEGER,
        defaultValue: 10,
      },
      required_non_tax_price: {
        type: Sequelize.DataTypes.DOUBLE,
      },
      required_taxed_price: {
        type: Sequelize.DataTypes.DOUBLE,
      },
      is_business: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_voluntary: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_combo: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
      },
      combo_price: {
        type: Sequelize.DataTypes.DOUBLE,
        defaultValue: 0,
      },
      voluntary_amount: {
        type: Sequelize.DataTypes.DOUBLE,
        defaultValue: 0,
      },
      voluntary_price: {
        type: Sequelize.DataTypes.DOUBLE,
        defaultValue: 0,
      },
      voluntary_seats: {
        type: Sequelize.DataTypes.INTEGER,
        defaultValue: 0,
      },
      insurance_amount: {
        type: Sequelize.DataTypes.DOUBLE,
        defaultValue: 30_000_000,
      },
      capacity: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      capacity_unit: {
        type: Sequelize.DataTypes.STRING,
        defaultValue: 'SEATS',
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
    return queryInterface.dropTable('insurance_products');
  },
};
