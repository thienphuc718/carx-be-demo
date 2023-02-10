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
    return queryInterface.createTable(
      'user_company_relations', {
        user_id: {
          type: Sequelize.DataTypes.UUID,
          references: {
            model: {
              tableName: 'users',
            },
            key: 'id',
          },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        },
        company_id: {
          type: Sequelize.DataTypes.UUID,
          references: {
            model: {
              tableName: 'companies',
            },
            key: 'id',
          },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        },
        created_at: {
          type: Sequelize.DataTypes.DATE,
        },
        updated_at: {
          type: Sequelize.DataTypes.DATE,
        }
      }, {
        schema: schemaConfig.name,
      },
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.dropTable('user_company_relations');
  },
};
