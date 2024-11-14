'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Book.belongsTo(models.Course, {
        as: "course",
        foreignKey: "courseId",
      })
      Book.belongsTo(models.Semester, {
        as: "semester",
        foreignKey: "semesterId",
      })
      Book.belongsTo(models.Subject, {
        as: "subject",
        foreignKey: "subjectId",
      })
      Book.belongsTo(models.User, {
        as: "user",
        foreignKey: "createdBy",
      })
    }
  }
  Book.init({
    bookName: DataTypes.STRING,
    writerName: DataTypes.STRING,
    fileName: DataTypes.STRING,
    fileType: DataTypes.STRING,
    courseId: DataTypes.INTEGER,
    semesterId: DataTypes.INTEGER,
    subjectId: DataTypes.INTEGER,
    status: DataTypes.BOOLEAN,
    createdBy: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};