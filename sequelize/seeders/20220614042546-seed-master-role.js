'use strict';
const schemaConfig = require(__dirname + '../../config/schema.js');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const [features] = await Promise.all([
      // get all features
      queryInterface.rawSelect('features', { plain: false }, ['id']),
      // create CARX company
      queryInterface.bulkInsert(
        'companies',
        [
          {
            id: 'de398550-75f1-42f0-9949-be43744617d0',
            name: 'CARX',
            is_deleted: false,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        { schema: schemaConfig.name },
      ),
    ]);

    // create role for super admin
    await queryInterface.bulkInsert(
      'roles',
      [
        {
          id: '3de05d69-6886-46e7-b426-225b5ab91526',
          name: 'SUPER ADMIN',
          company_id: 'de398550-75f1-42f0-9949-be43744617d0',
          is_deleted: false,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      { schema: schemaConfig.name },
    );

    const roleFeatures = features.map((feature) => ({
      role_id: '3de05d69-6886-46e7-b426-225b5ab91526',
      feature_id: feature.id,
      is_deleted: false,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    return queryInterface.bulkInsert(
      'role_feature_relations',
      roleFeatures,
      { schema: schemaConfig.name },
    );
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkDelete('roles', null, { schema: schemaConfig.name }),
      queryInterface.bulkDelete('role_feature_relations', null, {
        schema: schemaConfig.name,
      }),
    ]);
  },
};
