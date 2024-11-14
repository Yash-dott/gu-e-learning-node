const { updateRouter } = require('../../../routes/apiRouter')
const { validate, validateEmail, validatePhone } = require('../../../helpers/validations');
const { success } = require('../../../helpers/response')
const { wrapRequestHandler } = require('../../../helpers/response')
const { body } = require("express-validator");
const { Student, Log } = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')
const multer = require('multer')
const { fileUpload } = require('../../../helpers/fileUpload')
const fs = require('fs');



const updateStudent = async (req, res) => {
    const { studentId, name, mobile, email, courseId, semesterId, id } = req.body
    const tokenData = req.response.user
    const files = req.files
    let student

    if (files) {
        const { picture } = await Student.findOne({ where: { id }, attributes: ['picture'], raw: true })
        if (picture !== 'default-student.jpg'){
            fs.unlinkSync(`assets/uploads/students/${picture}`)
        }
        const { fileName, extension } = await fileUpload(files.file, 'uploads/students')
        student = await Student.update({ studentId, name, picture: fileName + extension, courseId, semesterId, mobile, email }, { where: { id } })
    } else {
        student = await Student.update({ studentId, name, courseId, semesterId, mobile, email }, { where: { id } })
    }
    await Log.create({ logTypeId: tokenData.logTypeId, description: `Student Successfully Updated By ${tokenData.name}`, createdBy: tokenData.id })
    res.json(success('Student updated', student))
}
updateRouter.post('/admin/student', authMiddleware(), validate([
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
    body('id').notEmpty().withMessage('Semester Id is Required'),
]), wrapRequestHandler(updateStudent))