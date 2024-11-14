const {retrieveRouter} = require('../../../../routes/apiRouter')
const {success, error} = require('../../../../helpers/response')
const {wrapRequestHandler} = require('../../../../helpers/response')
const {Course} = require('../../../../models')
const {studentAppAuthMiddleware} = require('../../../../middleware/authMiddleware')
const {Op} = require('sequelize');


const readCourses = async (req, res) => {

    const {search} = req.query;
    let where = {}

    if (search) {
        where = {
            "$Course.courseName$": {[Op.like]: `%${search}%`}
        }
    }
    console.log(search);
    const courses = await Course.findAll({
        where: {
            status: 1,
            ...where
        },
        attributes: ['id', 'courseName', 'totalSemester'],
        order: [['id', 'ASC']]
    });
    res.json(success('', {courses}));
}

retrieveRouter.get('/app/v1/student/courses',
    studentAppAuthMiddleware(),
    wrapRequestHandler(readCourses)
)