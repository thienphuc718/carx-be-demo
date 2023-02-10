'use strict';
const schemaConfig = require(__dirname + '../../config/schema.js');

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable(
      'reviews',
      {
        id: {
          primaryKey: true,
          type: Sequelize.DataTypes.UUID,
          defaultValue: Sequelize.DataTypes.UUIDV4,
        },
        order_id: {
          allowNull: false,
          type: Sequelize.DataTypes.UUID,
          references: {
            model: {
              tableName: 'orders',
            },
            key: 'id',
          },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        },
        agent_id: {
          allowNull: false,
          type: Sequelize.DataTypes.UUID,
          references: {
            model: {
              tableName: 'agents',
            },
            key: 'id',
          },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        },
        customer_id: {
          allowNull: false,
          type: Sequelize.DataTypes.UUID,
          references: {
            model: {
              tableName: 'customers',
            },
            key: 'id',
          },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        },
        product_id: {
          type: Sequelize.DataTypes.UUID,
          references: {
            model: {
              tableName: 'products',
            },
            key: 'id',
          },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        },
        service_id: {
          type: Sequelize.DataTypes.UUID,
          references: {
            model: {
              tableName: 'services',
            },
            key: 'id',
          },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        },
        points: {
          type: Sequelize.DataTypes.DECIMAL,
        },
        content: {
          type: Sequelize.DataTypes.TEXT,
        },
        images: {
          type: Sequelize.DataTypes.ARRAY(Sequelize.DataTypes.STRING),
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
      },
      { schema: schemaConfig.name },
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('reviews', {
      schema: schemaConfig.name,
    });
  },
};
