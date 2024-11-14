'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Role, {
        as: "role",
        foreignKey: "roleId",
      })
      User.hasMany(models.Userpermission, {
        as: "userPermission",
        foreignKey: "userId",
      })
      User.belongsTo(models.User, {
        as: "user",
        foreignKey: "createdBy",
      })
    }
  }
  User.init({
    name: DataTypes.STRING,
    mobile: DataTypes.STRING,
    password: DataTypes.STRING,
    picture: DataTypes.STRING,
    roleId: DataTypes.INTEGER,
    status: DataTypes.BOOLEAN,
    createdBy: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};