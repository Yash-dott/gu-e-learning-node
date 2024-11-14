'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Timetable extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Timetable.belongsTo(models.Course, {
        as: "course",
        foreignKey: "courseId",
      })
      Timetable.belongsTo(models.Semester, {
        foreignKey: "semesterId",
        as: "semester"
      })
      Timetable.belongsTo(models.User, {
        foreignKey: "createdBy",
        as: "user"
      })
    }
  }
  Timetable.init({
    courseId: DataTypes.INTEGER,
    semesterId: DataTypes.INTEGER,
    picture: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
    createdBy: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Timetable',
  });
  return Timetable;
};