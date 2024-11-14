const { createRouter } = require('../../../routes/apiRouter')
const { validate } = require('../../../helpers/validations');
const { success, error } = require('../../../helpers/response')
const { wrapRequestHandler } = require('../../../helpers/response')
const { body } = require("express-validator");
const { Timetable, Log } = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')
const { fileUpload } = require('../../../helpers/fileUpload')
const { Op } = require('sequelize');




const createTimeTable = async (req, res) => {
    const { courseId, semesterId, createdBy } = req.body
    const files = req.files
    const tokenData = req.response.user

    if (!files) {
        res.json(error('Please select a file.'))
    }
    let timeTable = await Timetable.findOne({
        where: {
            [Op.and]: [
                { courseId },
                { semesterId }
            ]
        }
    })
    if (!timeTable) {
        const { fileName, extension } = await fileUpload(files.file, 'uploads/time-tables')
        timeTable = await Timetable.create({ picture: fileName + extension, courseId, semesterId, createdBy, status: 0 })
        Log.create({ logTypeId: tokenData.logTypeId, description: `Timetable Successfully Added By ${tokenData.name}`, createdBy: tokenData.id })
        res.json(success('Time Table created', timeTable))
    } else {
        res.json(error('Time Table already exist'))
    }
}

createRouter.post('/admin/time-table', authMiddleware(), validate([
    body('courseId').notEmpty().withMessage('Course Id is Required'),
    body('semesterId').notEmpty().withMessage('Semester Id is Required'),
]), wrapRequestHandler(createTimeTable))