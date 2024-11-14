'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Student.belongsTo(models.Course, {
        as: "course",
        foreignKey: "courseId",
      })
      Student.belongsTo(models.Semester, {
        foreignKey: "semesterId",
        as: "semester"
      })
      Student.belongsTo(models.User, {
        foreignKey: "createdBy",
        as: "user"
      })

      Student.belongsTo(models.Course, { foreignKey: 'courseId' });
    }
  }


  Student.init({
    studentId: DataTypes.STRING,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    mobile: DataTypes.STRING,
    password:  DataTypes.TEXT('long'),
    picture: DataTypes.STRING,
    courseId: DataTypes.INTEGER,
    semesterId: DataTypes.INTEGER,
    FCM: DataTypes.TEXT('long'),
    status: DataTypes.BOOLEAN,
    createdBy: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Student',
  });
  return Student;
};