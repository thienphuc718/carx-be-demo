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
    queryInterface.createTable('customers', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4
      },
      full_name: {
        type: Sequelize.DataTypes.STRING,
      },
      first_name: {
        type: Sequelize.DataTypes.STRING,
      },
      last_name: {
        type: Sequelize.DataTypes.STRING,
      },
      email: {
        type: Sequelize.DataTypes.STRING,
      },
      phone_number: {
        type: Sequelize.DataTypes.STRING,
      },
      avatar: {
        type: Sequelize.DataTypes.STRING,
      },
      gender: {
        type: Sequelize.DataTypes.STRING,
      },
      birthday: {
        type: Sequelize.DataTypes.STRING,
      },
      address: {
        type: Sequelize.DataTypes.STRING,
      },
      note: {
        type: Sequelize.DataTypes.STRING,
      },
      district_id: {
        type: Sequelize.DataTypes.UUID,
      },
      country_code: {
        type: Sequelize.DataTypes.STRING,
      },
      city_id: {
        type: Sequelize.DataTypes.UUID,
      },
      customer_class_id: {
        type: Sequelize.DataTypes.UUID,
      },
      customer_club_id: {
        type: Sequelize.DataTypes.UUID,
      },
      schema: {
        type: Sequelize.DataTypes.STRING,
      },
      tags: {
        type: Sequelize.DataTypes.ARRAY(Sequelize.DataTypes.TEXT),
      },
      point: {
        type: Sequelize.DataTypes.INTEGER,
      },
      is_deleted: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false
      },
      created_at: {
        type: Sequelize.DataTypes.DATE,
      },
      updated_at: {
        type: Sequelize.DataTypes.DATE,
      }
    }, {
      schema: schemaConfig.name
    })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('customers');
     */
    queryInterface.dropTable('customers', {
      schema: schemaConfig.name
    });
  }
};
