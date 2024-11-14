const { updateRouter } = require('../../../routes/apiRouter')
const { validate } = require('../../../helpers/validations');
const { success, error } = require('../../../helpers/response')
const { wrapRequestHandler } = require('../../../helpers/response')
const { body } = require("express-validator");
const { Subject, Log } = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')


const updateSubject = async (req, res) => {
    const { subjectName, courseId, semesterId, id } = req.body
    const tokenData = req.response.user

    const subject = await Subject.findOne({ where: { id } })

    if (subject.subjectName === subjectName && subject.courseId === courseId && subject.semesterId === semesterId) {
        res.json(error('Nothing to change'))

    } else {
        Subject.update({ subjectName, courseId, semesterId }, { where: { id: id } })
        Log.create({ logTypeId: tokenData.logTypeId, description: `Subject Successfully Updated By ${tokenData.name}`, createdBy: tokenData.id })
        res.json(success('Successfully updated'))
    }
}

updateRouter.post('/admin/subject', authMiddleware(), validate([
    body('subjectName').notEmpty().withMessage('Subject Name is Required'),
    body('courseId').notEmpty().withMessage('Course Name is Required'),
    body('semesterId').notEmpty().withMessage('Semester is Required'),
    body('id').notEmpty().withMessage('Id is Required')
]), wrapRequestHandler(updateSubject))