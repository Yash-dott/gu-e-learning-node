const { updateRouter } = require('../../../routes/apiRouter')
const { validate } = require('../../../helpers/validations');
const { success } = require('../../../helpers/response')
const { wrapRequestHandler } = require('../../../helpers/response')
const { body } = require("express-validator");
const { Timetable, Log } = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')
const { fileUpload } = require('../../../helpers/fileUpload')
const fs = require('fs');

const updateTimeTable = async (req, res) => {
    const { courseId, semesterId, id } = req.body
    const files = req.files
    const tokenData = req.response.user
    let timeTable

    if (files) {
        const oldBookFileName = await Timetable.findOne({ where: { id }, attributes: ['picture'], raw: true })
        fs.unlinkSync(`assets/uploads/time-tables/${oldBookFileName.picture}`)
        const { fileName, extension } = await fileUpload(files.file, 'uploads/time-tables')
        timeTable = await Timetable.update({ picture: fileName + extension, courseId, semesterId }, { where: { id } })
    } else {
        timeTable = await Timetable.update({ courseId, semesterId }, { where: { id } })
    }
    Log.create({ logTypeId: tokenData.logTypeId, description: `Timetable Successfully Updated By ${tokenData.name}`, createdBy: tokenData.id })
    res.json(success('Successfully updated', timeTable))
}
updateRouter.post('/admin/time-table', authMiddleware(), validate([
    body('courseId').notEmpty().withMessage('Course Id is Required'),
    body('semesterId').notEmpty().withMessage('Semester Id is Required'),
    body('id').notEmpty().withMessage('Id is Required')
]), wrapRequestHandler(updateTimeTable))