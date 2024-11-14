'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Log extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Log.belongsTo(models.User, {
        foreignKey: 'createdBy',
        as: 'user'
      })
    }
  }
  Log.init({
    description: DataTypes.STRING,
    logTypeId: DataTypes.INTEGER,
    createdBy: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Log',
  });
  return Log;
};