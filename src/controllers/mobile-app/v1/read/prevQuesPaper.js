const {retrieveRouter} = require('../../../../routes/apiRouter')
const {success, error} = require('../../../../helpers/response')
const {wrapRequestHandler} = require('../../../../helpers/response')
const {Semester, Course, PrevQuesPaper, Subject, User} = require('../../../../models')
const {studentAppAuthMiddleware} = require('../../../../middleware/authMiddleware')
const {Op} = require('sequelize');


const readPrevQuesPaper = async (req, res) => {

    const {search, courseId} = req.query;
    let where = {}

    if (search) {
        where = {
            "$subject.subjectName$": {[Op.like]: `%${search}%`}
        }
    }
    if (courseId) {
        where = {
            ...where,
            courseId
        }
    }

    let prevQuesPapers = await PrevQuesPaper.findAll({
        where: {
            status: 1,
            ...where
        },
        include: [
            {model: Course, as: "course", attributes: ['courseName']},
            {model: Semester, as: "semester", attributes: ['semester']},
            {model: Subject, as: "subject", attributes: ['subjectName']},
        ],
        order: [['id', 'DESC']]
    })

    res.json(success('', {prevQuesPapers}));
}

retrieveRouter.get('/app/v1/student/prevQuesPaper',
    studentAppAuthMiddleware(),
    wrapRequestHandler(readPrevQuesPaper)
)