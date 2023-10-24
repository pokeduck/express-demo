import { Sequelize, DataTypes } from "sequelize";
import config from "../config/db.config.js";
const sequelize = new Sequelize(
  config.table,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialet,
    logging: (...msg) => console.log(msg),
  }
);

export default (dao) => {
  return dao(sequelize, DataTypes);
};
