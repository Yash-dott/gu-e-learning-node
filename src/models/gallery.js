'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Gallery extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Gallery.init({
    picture: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
    createdBy: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Gallery',
  });
  return Gallery;
};