const {retrieveRouter} = require('../../../../routes/apiRouter')
const {success, error} = require('../../../../helpers/response')
const {wrapRequestHandler} = require('../../../../helpers/response')
const {Course, Syllabus, Semester, User} = require('../../../../models')
const {studentAppAuthMiddleware} = require('../../../../middleware/authMiddleware')
const {Op} = require('sequelize');


const readSyllabus = async (req, res) => {

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

    const syllabus = await Syllabus.findAll({
        where: {
            status: 1,
            ...where
        },
        attributes: ['id', 'file'],
        include: [
            { model: Course, as: "course", attributes: ['id', 'courseName'] },
            { model: Semester, as: "semester", attributes: ['id','semester'] },
        ],
        order: [['id', 'DESC']]
    });
    res.json(success('', {syllabus}));
}

retrieveRouter.get('/app/v1/student/syllabus',
    studentAppAuthMiddleware(),
    wrapRequestHandler(readSyllabus)
)