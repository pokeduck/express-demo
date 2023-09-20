"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Token extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Token.init(
    {
      userId: DataTypes.STRING,
      tokenValue: DataTypes.STRING,
      //createAt: DataTypes.DATE,
      //expiredAt: DataTypes.DATE,
      usageState: DataTypes.STRING,
      tokenType: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Tokens",
    }
  );
  return Token;
};
