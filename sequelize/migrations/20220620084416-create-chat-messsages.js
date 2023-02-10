'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.createTable('chat_messages', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.DataTypes.UUIDV4,
        allowNull: false,
      },  
      sender_id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
      },
      receiver_id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
      },
      conversation_id: {
        type: Sequelize.DataTypes.UUID,        
        allowNull: false,
        references: {
          model: {
            tableName: 'chat_conversations',
          },
          key: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
      message: {
        type: Sequelize.DataTypes.JSONB,
        allowNull: false,
      },
      is_deleted: {
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
    return queryInterface.dropTable('chat_messages');
  },
};
