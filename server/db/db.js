const Sequelize = require("sequelize");

require('dotenv').config();

const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
  logging: false,
  host: 'localhost',
  dialect:'postgres',
  port: '5432',
  protocol: 'postgres'
});

module.exports = db;
