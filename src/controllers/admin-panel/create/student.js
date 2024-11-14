const { createRouter } = require('../../../routes/apiRouter')
const { validate, validatePhone, validateEmail } = require('../../../helpers/validations');
const { success, error } = require('../../../helpers/response')
const { wrapRequestHandler } = require('../../../helpers/response')
const { body } = require("express-validator");
const { Student, Log } = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')
const multer = require('multer')
const { fileUpload } = require('../../../helpers/fileUpload')
const {generateBcrypt} = require("../../../helpers/bcrypt");




const createStudent = async (req, res) => {
    const { studentId, name, mobile, email, courseId, semesterId } = req.body
    const files = req.files;
    const tokenData = req.response.user;
    let student;
    let password = await generateBcrypt(name.split(' ')[0].toLowerCase() +  mobile.slice(-4));

    if (files) {
        const { fileName, extension } = await fileUpload(files.file, 'uploads/students');
        student = await Student.create({ studentId, name, mobile, email, password,picture: fileName + extension, courseId, semesterId, createdBy: tokenData.id, status: 0 })
    }else {
        student = await Student.create({ studentId, name, mobile, email, password,picture: 'default-student.jpg', courseId, semesterId, createdBy: tokenData.id, status: 0 })
    }

    await Log.create({ logTypeId: tokenData.logTypeId, description: `Student Successfully Added By ${tokenData.name}`, createdBy: tokenData.id })
    res.json(success('Student created', student))
}

createRouter.post('/admin/student', authMiddleware(), validate([
    body('studentId').notEmpty().withMessage('Student Id is Required'),
    body('name').notEmpty().withMessage('Name is Required'),
    body('mobile').notEmpty().withMessage('Mobile Number is Required').custom(async (mobile) => {
        if (!validatePhone(mobile)) {
            throw new Error("Please enter valid Mobile Number");
        }
        return true;
    }),
    body('email').notEmpty().withMessage('Email is Required').custom(async (email) => {
        if (!validateEmail(email)) {
            throw new Error("Please enter valid Email");
        }
        return true;
    }),
    body('courseId').notEmpty().withMessage('Course Id is Required'),
    body('semesterId').notEmpty().withMessage('Semester Id is Required'),
]), wrapRequestHandler(createStudent))