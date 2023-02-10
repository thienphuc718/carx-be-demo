'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.createTable('sms_vendor_responses', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.DataTypes.UUIDV4,
      },
      user_id: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'users'
          },
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
      sms_id: {
        type: Sequelize.DataTypes.STRING,
      },
      receive_time: {
        type: Sequelize.DataTypes.DATE,
      },
      deliver_time: {
        type: Sequelize.DataTypes.DATE,
      },
      status: {
        type: Sequelize.DataTypes.INTEGER,
      },
      sent_user: {
        type: Sequelize.DataTypes.STRING,
      },
      to: {
        type: Sequelize.DataTypes.STRING,
      },
      from: {
        type: Sequelize.DataTypes.STRING,
      },
      error_code: {
        type: Sequelize.DataTypes.INTEGER,
      },
      carrier: {
        type: Sequelize.DataTypes.STRING,
      },
      mnp: {
        type: Sequelize.DataTypes.INTEGER,
      }
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.dropTable('sms_vendor_responses');
  }
};
