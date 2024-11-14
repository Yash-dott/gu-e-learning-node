const {retrieveRouter} = require('../../../../routes/apiRouter')
const {success, error} = require('../../../../helpers/response')
const {wrapRequestHandler} = require('../../../../helpers/response')
const {Course, Syllabus, Semester} = require('../../../../models')
const {studentAppAuthMiddleware} = require('../../../../middleware/authMiddleware')
const {Op} = require('sequelize');


const readCourseInfo = async (req, res) => {

    const {courseId} = req.query;

    const course = await Course.findByPk(courseId, {
        attributes: ['id', 'courseName', 'totalSemester', 'description'],
    })
    const syllabus = await Syllabus.findAll({
        where: {
            courseId,
            status: true
        },
        include: [{
            model: Semester,
            as: 'semester',
            attributes: ['id', 'semester']
        },
            {
                model: Course,
                as: 'course',
                attributes: ['id', 'courseName']
            }
        ]
    })
    res.json(success('', {course, syllabus}));
}

retrieveRouter.get('/app/v1/student/course-info',
    studentAppAuthMiddleware(),
    wrapRequestHandler(readCourseInfo)
)