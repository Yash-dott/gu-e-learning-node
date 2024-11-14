'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Faq extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Faq.belongsTo(models.User, {
        foreignKey: 'createdBy',
        as: 'user'
      })
    }
  }
  Faq.init({
    question: DataTypes.STRING,
    answer: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
    createdBy: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Faq',
  });
  return Faq;
};