const {retrieveRouter} = require('../../../../routes/apiRouter')
const {success, error} = require('../../../../helpers/response')
const {wrapRequestHandler} = require('../../../../helpers/response')
const {Timetable, Semester, Course} = require('../../../../models')
const {studentAppAuthMiddleware} = require('../../../../middleware/authMiddleware')
const {Op} = require('sequelize');


const readTimeTables = async (req, res) => {

    const {search, courseId} = req.query;
    let where = {}

    if (search) {
        where = {
            "$Course.courseName$": {[Op.like]: `%${search}%`}
        }
    }
    if (courseId) {
        where = {
            ...where,
            courseId
        }
    }
    console.log(where)
    const timeTables = await Timetable.findAll({
        where: {
            status: 1,
            ...where
        },
        include: [{
            model: Semester,
            as: 'semester'
        },
            {
                model: Course,
                as: 'course'
            }
        ],
        // attributes: ['id', 'courseName', 'totalSemester'],
        order: [['id', 'DESC']]
    });
    res.json(success('', {timeTables}));
}

retrieveRouter.get('/app/v1/student/time-tables',
    studentAppAuthMiddleware(),
    wrapRequestHandler(readTimeTables)
)