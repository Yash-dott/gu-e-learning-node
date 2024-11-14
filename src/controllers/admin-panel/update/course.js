const { updateRouter } = require('../../../routes/apiRouter')
const { validate } = require('../../../helpers/validations');
const { success, error } = require('../../../helpers/response')
const { wrapRequestHandler } = require('../../../helpers/response')
const { body } = require("express-validator");
const { Course, Log } = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')


const updateCourse = async (req, res) => {
    const { courseName, totalSemester, id, description } = req.body
    const tokenData = req.response.user
    
    const course = await Course.findOne({ where: { id } })

    if (course.courseName === courseName && course.totalSemester === totalSemester &&course.description === description) {
        res.json(error('Nothing to change'))
    } else {
        Course.update({ courseName: courseName.toUpperCase(), totalSemester: totalSemester, description }, { where: { id: id } })
        await Log.create({ logTypeId: tokenData.logTypeId, description: `Course Successfully Updated By ${tokenData.name}`, createdBy: tokenData.id })
        res.json(success('Successfully updated'))
    }
}


updateRouter.post('/admin/course', authMiddleware(), validate([
    body('courseName').notEmpty().withMessage('Course Name is Required'),
    body('totalSemester').notEmpty().withMessage('Total Semester is Required'),
    body('description').notEmpty().withMessage('Description is Required'),
]), wrapRequestHandler(updateCourse))