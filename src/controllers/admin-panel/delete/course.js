const { deleteRouter } = require('../../../routes/apiRouter')
const { validate } = require('../../../helpers/validations');
const { success, error } = require('../../../helpers/response')
const { wrapRequestHandler } = require('../../../helpers/response')
const { body } = require("express-validator");
const { Course, Semester, Subject, Book, Timetable, Log } = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')



const deleteCourse = async (req, res) => {
    const { id } = req.body
    const tokenData = req.response.user

    let course = await Course.destroy({ where: { id } })

    if (course) {
        Semester.destroy({ where: { courseId: id } })
        Subject.destroy({ where: { courseId: id } })
        Book.destroy({ where: { courseId: id } })
        Timetable.destroy({ where: { courseId: id } })
        Log.create({ logTypeId: tokenData.logTypeId, description: `Course Successfully Deleted By ${tokenData.name}`, createdBy: tokenData.id })
        res.json(success('Course deleted'))
    } else {
        res.json(error('Course does not exist'))
    }
}


deleteRouter.post('/admin/course', authMiddleware(), validate([
    body('id').notEmpty().withMessage('Id is Required'),
]), wrapRequestHandler(deleteCourse))