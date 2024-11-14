'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Userpermission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Userpermission.belongsTo(models.Permission, {
        as: "permission",
        foreignKey: "permissionId",
      })
    }
  }
  Userpermission.init({
    userId: DataTypes.INTEGER,
    permissionId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Userpermission',
  });
  return Userpermission;
};