"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UsersComment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UsersComment.init(
    {
      userId: DataTypes.STRING,
      contentId: DataTypes.STRING,
      parentId: DataTypes.STRING,
      text: DataTypes.STRING,
      //createAt: DataTypes.DATE,
      //modifyAt: DataTypes.DATE,
      upvotes: DataTypes.INTEGER,
      downvotes: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "UsersComment",
    }
  );
  return UsersComment;
};
