'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Syllabus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Syllabus.belongsTo(models.Course, {
        as: "course",
        foreignKey: "courseId",
      })
      Syllabus.belongsTo(models.Semester, {
        as: "semester",
        foreignKey: "semesterId",
      })
      Syllabus.belongsTo(models.User, {
        as: "user",
        foreignKey: "createdBy",
      })
    }
  }
  Syllabus.init({
    courseId: DataTypes.INTEGER,
    semesterId: DataTypes.INTEGER,
    file: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
    createdBy: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Syllabus',
  });
  return Syllabus;
};