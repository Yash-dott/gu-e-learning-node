'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Job extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Job.init({
    jobTitle: DataTypes.STRING,
    jobDescription:  DataTypes.TEXT('long'),
    course: DataTypes.STRING,
    jobLogo: DataTypes.STRING,
    link: DataTypes.STRING,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Job',
  });
  return Job;
};