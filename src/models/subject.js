'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Subject extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Subject.belongsTo(models.Course, {
        as: "course",
        foreignKey: "courseId",
      })
      Subject.belongsTo(models.Semester, {
        foreignKey: "semesterId",
        as: "semester"
      })
      Subject.belongsTo(models.User, {
        foreignKey: "createdBy",
        as: "user"
      })
    }
  }
  Subject.init({
    subjectName: DataTypes.STRING,
    courseId: DataTypes.INTEGER,
    semesterId: DataTypes.INTEGER,
    status: DataTypes.BOOLEAN,
    createdBy: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Subject',
  });
  return Subject;
};