'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.createTable('insurance_contracts', {
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
        onDelete: 'set null',
        onUpdate: 'cascade',
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
        onDelete: 'set null',
        onUpdate: 'cascade',
      },
      customer_name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      customer_email: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      customer_phone_number: {
        type: Sequelize.DataTypes.STRING,
      },
      customer_certificate_type: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      customer_certificate_number: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      frame_no: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      engine_no: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      contract_no: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      voluntary_contract_no: {
        type: Sequelize.DataTypes.STRING,
        // allowNull: false,
      },
      carx_contract_number: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      send_date: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      start_date: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      end_date: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
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
    return queryInterface.dropTable('insurance_contracts')
  },
};
