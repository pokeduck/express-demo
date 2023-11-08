"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CommentHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CommentHistory.init(
    {
      userId: DataTypes.STRING,
      commentId: DataTypes.STRING,
      action: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "CommentHistory",
    }
  );
  return CommentHistory;
};
