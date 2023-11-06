"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Users.hasMany(models.CommentHistory, {
        foreignKey: {
          name: "userId",
          allowNull: false,
          onDelete: "NO ACTION",
          onUpdate: "NO ACTION",
        },
      });
      // define association here
    }
  }
  Users.init(
    {
      userName: DataTypes.STRING,
      email: DataTypes.STRING,
      modifyAt: DataTypes.DATE,
      password: DataTypes.STRING,
      authToken: DataTypes.STRING,
      profilePicture: DataTypes.STRING,
      verificationStatus: DataTypes.STRING,
      userId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Users",
    }
  );
  return Users;
};
