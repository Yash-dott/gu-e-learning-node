const { createRouter } = require('../../../routes/apiRouter')
const { validate } = require('../../../helpers/validations');
const { success, error } = require('../../../helpers/response')
const { wrapRequestHandler } = require('../../../helpers/response')
const { body } = require("express-validator");
const { Course, Semester, Log } = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')
const { verifyJWT } = require('../../../helpers/token')


const createCourse = async (req, res) => {
    const { courseName, totalSemester, description } = req.body
    const tokenData = req.response.user
    let course = await Course.findOne({ where: { courseName } })

    if (!course) {
        course = await Course.create({ courseName: courseName.toUpperCase(), totalSemester: totalSemester, description,status: 0, createdBy: tokenData.id })
        for (let i = 1; i <= totalSemester; i++) {
            let semester
            switch (i) {
                case 1:
                    semester = i + 'st';
                    break;
                case 2:
                    semester = i + 'nd';
                    break;
                case 3:
                    semester = i + 'rd';
                    break;
                default:
                    semester = i + 'th';
            }
            await Semester.create({
                semester: semester,
                courseId: course.id,
                createdBy: tokenData.id
            })
        }
        await Log.create({ logTypeId: tokenData.logTypeId, description: `Course Successfully Added By ${tokenData.name}`, createdBy: tokenData.id })
        res.send(success('Course created', course))
    } else {
        res.send(error('Course already exist'))
    }
}


createRouter.post('/admin/course', authMiddleware(), validate([
    body('courseName').notEmpty().withMessage('Course Name is Required'),
    body('totalSemester').notEmpty().withMessage('Total Semester is Required'),
    body('description').notEmpty().withMessage('Description is Required'),
]), wrapRequestHandler(createCourse))