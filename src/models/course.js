'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Course.belongsTo(models.User, {
        foreignKey: "createdBy",
        as: "user"
      })
      Course.hasMany(models.Student, { foreignKey: 'courseId' });

    }
  }
  Course.init({
    courseName: DataTypes.STRING,
    totalSemester: DataTypes.INTEGER,
    description: DataTypes.TEXT('long'),
    status: DataTypes.BOOLEAN,
    createdBy: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Course',
  });
  return Course;
};