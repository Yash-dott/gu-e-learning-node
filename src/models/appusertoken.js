'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AppUserToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AppUserToken.init({
    userId: DataTypes.INTEGER,
    token: DataTypes.TEXT('long')
  }, {
    sequelize,
    modelName: 'AppUserToken',
  });
  return AppUserToken;
};