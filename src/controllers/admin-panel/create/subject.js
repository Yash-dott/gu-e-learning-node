const { createRouter } = require('../../../routes/apiRouter')
const { validate } = require('../../../helpers/validations');
const { success, error } = require('../../../helpers/response')
const { wrapRequestHandler } = require('../../../helpers/response')
const { body } = require("express-validator");
const { Subject, Log } = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')
const {generateBcrypt} = require("../../../helpers/bcrypt");



const createCourse = async (req, res) => {
    const { subjectName, semesterId, courseId, createdBy } = req.body
    const tokenData = req.response.user
    let subject = await Subject.findOne({ where: { subjectName } })

    if (!subject) {

        const subject = await Subject.create({ subjectName, courseId, semesterId, status: 0, createdBy })
       await Log.create({ logTypeId: tokenData.logTypeId, description: `Subject Successfully Added By ${tokenData.name}`, createdBy: tokenData.id })
        res.json(success('Subject created', subject))
    } else {
        res.json(error('Subject already exist'))
    }
}


createRouter.post('/admin/subject', authMiddleware(), validate([
    body('subjectName').notEmpty().withMessage('Subject Name is Required'),
    body('courseId').notEmpty().withMessage('Course is Required'),
    body('semesterId').notEmpty().withMessage('Semester is Required'),
]), wrapRequestHandler(createCourse))