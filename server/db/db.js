const Sequelize = require("sequelize");

require("dotenv").config();

const db = new Sequelize(
  process.env.DATABASE_URL ||
    `postgres://${process.env.DB_USER}:${process.env.DB_PW}@localhost:5432/${process.env.DB_NAME}`,
  {
    logging: false,
  }
);

module.exports = db;
