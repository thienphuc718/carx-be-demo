'use strict';
const schemaConfig = require(__dirname + '../../config/schema.js');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'users',
      [
        {
          id: '2805ff71-cfa5-4321-a1a9-42b6c74bf426',
          email: 'super_admin@yopmail.com',
          // password: carx@0407
          password:
            '$2b$10$HSXvyA9oIV6M.SfIpkFpWO0ZqCHRHNuADhUE8fNREgSF5KU/rQWZi',
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjI4MDVmZjcxLWNmYTUtNDMyMS1hMWE5LTQyYjZjNzRiZjQyNiIsImZ1bGxfbmFtZSI6bnVsbCwiZW1haWwiOiJzdXBlcl9hZG1pbkB5b3BtYWlsLmNvbSIsInNjaGVtYSI6InB1YmxpYyIsImlhdCI6MTY1NTE4Mzk4NiwiZXhwIjoxNjg2NzE5OTg2fQ.d91IjoKDI3lYAu0zCEVq-aMMQOoAXcSR4hDw_KYITOI',
          method: 'EMAIL',
          role_id: '3de05d69-6886-46e7-b426-225b5ab91526',
          is_banned: false,
          is_verified: true,
          is_deleted: false,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      { schema: schemaConfig.name },
    );
    return Promise.all([
      queryInterface.bulkInsert(
        'staffs',
        [
          {
            id: '44bf969e-b34d-4fa4-a750-c5f0f7a30ca8',
            user_id: '2805ff71-cfa5-4321-a1a9-42b6c74bf426',
            is_deleted: false,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        { schema: schemaConfig.name },
      ),
      queryInterface.bulkInsert(
        'user_company_relations',
        [
          {
            user_id: '2805ff71-cfa5-4321-a1a9-42b6c74bf426',
            company_id: 'de398550-75f1-42f0-9949-be43744617d0',
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        { schema: schemaConfig.name },
      ),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkDelete(
        'staffs',
        { id: '44bf969e-b34d-4fa4-a750-c5f0f7a30ca8' },
        { schema: schemaConfig.name },
      ),
      queryInterface.bulkDelete(
        'user_company_relations',
        {
          user_id: '2805ff71-cfa5-4321-a1a9-42b6c74bf426',
          company_id: 'de398550-75f1-42f0-9949-be43744617d0',
        },
        { schema: schemaConfig.name },
      ),
      queryInterface.bulkDelete(
        'users',
        { id: '2805ff71-cfa5-4321-a1a9-42b6c74bf426' },
        { schema: schemaConfig.name },
      ),
    ]);
  },
};
