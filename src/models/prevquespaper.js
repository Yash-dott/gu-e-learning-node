'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PrevQuesPaper extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      PrevQuesPaper.belongsTo(models.Course, {
        as: "course",
        foreignKey: "courseId",
      })
      PrevQuesPaper.belongsTo(models.Semester, {
        as: "semester",
        foreignKey: "semesterId",
      })
      PrevQuesPaper.belongsTo(models.Subject, {
        as: "subject",
        foreignKey: "subjectId",
      })
      PrevQuesPaper.belongsTo(models.User, {
        as: "user",
        foreignKey: "createdBy",
      })
    }
  }
  PrevQuesPaper.init({
    courseId: DataTypes.INTEGER,
    semesterId: DataTypes.INTEGER,
    subjectId: DataTypes.INTEGER,
    session: DataTypes.STRING,
    file: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
    createdBy: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PrevQuesPaper',
  });
  return PrevQuesPaper;
};