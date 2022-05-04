const { Client } = require("pg");
require("dotenv").config();
// const { pgUser, pgHost, pgPassword, pgPort, pgDb } = require("../config/index");
const client = new Client({
  user: process.env.USER_NAME,
  host: process.env.HOST_NAME,
  database: process.env.DATABASE_NAME,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
client.connect(function (err) {
  if (err) {
    return console.log("not connect with database", err);
  }
  console.log("Connected!");
});

module.exports = client;
