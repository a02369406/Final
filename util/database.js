const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  "",  // database
  "",  // username
  "",  // password
  {
    dialect: "mysql",
    host: "hsb-web-dev.ckm1cfmd3i4j.us-west-2.rds.amazonaws.com",
    logging: false
  }
);

module.exports = sequelize;
