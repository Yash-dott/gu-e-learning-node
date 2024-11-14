const {retrieveRouter} = require('../../../../routes/apiRouter')
const {success, error} = require('../../../../helpers/response')
const {wrapRequestHandler} = require('../../../../helpers/response')
const {Book, Subject} = require('../../../../models')
const {studentAppAuthMiddleware} = require('../../../../middleware/authMiddleware')
const {Op} = require('sequelize');


const readCourses = async (req, res) => {

    const {search, courseId} = req.query;
    let where = {}

    if (search) {
        where = {
            "$Book.bookName$": {[Op.like]: `%${search}%`}
        }
    }
    if (courseId) {
        where = {
            ...where,
            courseId
        }
    }
    const books = await Book.findAll({
        where: {
            status: 1,
            ...where
        },
        include: [{
            model: Subject,
            as: 'subject'
        }],
        // attributes: ['id', 'courseName', 'totalSemester'],
        order: [['id', 'DESC']]
    });
    res.json(success('', {books}));
}

retrieveRouter.get('/app/v1/student/books',
    studentAppAuthMiddleware(),
    wrapRequestHandler(readCourses)
)