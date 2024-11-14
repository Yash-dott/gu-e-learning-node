'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class University extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      University.belongsTo(models.User, {
        foreignKey: "createdBy",
        as: "user"
      })
    }
  }
  University.init({
    universityName: DataTypes.STRING,
    resultLink: DataTypes.STRING,
    websiteLink: DataTypes.STRING,
    picture: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
    createdBy: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'University',
  });
  return University;
};