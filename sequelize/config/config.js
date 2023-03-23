require('dotenv').config();
const schemaConfig = require(__dirname + '/schema.js');

module.exports = {
  development: {
    username: `postgres`,
    password: `thienphuc718`,
    database: `carx_be_demo`,
    host: `localhost`,
    port: 5432,
    dialect: 'postgres',
    schema: 'public'
  },
  staging: {
    username: `${process.env.DB_USERNAME}`,
    password: `${process.env.DB_PASSWORD}`,
    database: `${process.env.DB_NAME}`,
    host: `${process.env.DB_HOST}`,
    dialect: 'postgres',
    schema: schemaConfig.name
  },
  production: {
    username: `${process.env.DB_USERNAME}`,
    password: `${process.env.DB_PASSWORD}`,
    database: `${process.env.DB_NAME}`,
    host: `${process.env.DB_HOST}`,
    dialect: 'postgres',
    schema: schemaConfig.name
  },
};
