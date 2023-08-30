'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Assets extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Assets.init({
    name: DataTypes.STRING,
    minetype: DataTypes.STRING,
    url: DataTypes.STRING,
    type: DataTypes.STRING,
    uploadAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Assets',
  });
  return Assets;
};