const {retrieveRouter} = require('../../../routes/apiRouter')
const {success, error} = require('../../../helpers/response')
const {wrapRequestHandler} = require('../../../helpers/response')
const {Book, Course, Semester, User, Student, sequelize} = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')
const {Op} = require('sequelize');


const readDashboard = async (req, res) => {

    const topCourses = await Course.findAll({
        attributes: [
            'id',
            'courseName',
            [sequelize.fn('COUNT', sequelize.col('Students.id')), 'studentCount']
        ],
        include: [{
            model: Student,
            as: 'Students',
            attributes: []
        }],
        group: ['Course.id'],
        order: [[sequelize.literal('studentCount'), 'DESC']],
        limit: 3,
        subQuery: false
    });
    res.json(success('Successfully retrieve', {topCourses}))

}

retrieveRouter.get('/admin/dashboard', authMiddleware(), wrapRequestHandler(readDashboard))