const {retrieveRouter} = require('../../../routes/apiRouter')
const {success, error} = require('../../../helpers/response')
const {wrapRequestHandler} = require('../../../helpers/response')
const {Subject, Course, Semester, User, Timetable, sequelize} = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')
const {Op} = require('sequelize');


const readTimeTables = async (req, res) => {
    const {limit, page, search, status, courseId, semesterId} = req.query

    let where = {}
    if (search) {
        // where = { subjectName: { [Op.like]: "%" + search + "%" } }
    } else {
        if (courseId) {
            where = {...where, courseId: courseId}
        }
        if (semesterId) {
            where = {...where, semesterId: semesterId}
        }
        if (status) {
            where = {...where, status: status}
        }
    }

    let timeTables = await Timetable.findAll({
        where,
        include: [
            {model: Course, as: "course", attributes: []},
            {model: Semester, as: "semester", attributes: []},
            {model: User, as: 'user', attributes: []}
        ],
        attributes: [
            'id',
            'picture',
            [sequelize.col('course.courseName'), 'courseName'],
            [sequelize.col('course.id'), 'courseId'],
            [sequelize.col('semester.semester'), 'semesterName'],
            [sequelize.col('semester.id'), 'semesterId'],
            'status',
            [sequelize.col('user.name'), 'createdBy'],
            'createdAt',
            'updatedAt'
        ],
        limit: +limit,
        offset:  page * limit,
        order: [['id', 'DESC']],
    })

    if (timeTables.length) {
        let rows = await Timetable.count()
        res.send(success('Successfully retrieve', {rows: timeTables, totalRecords: rows}))
    } else {
        res.send(success('Successfully retrieve', {rows: [], totalRecords: 0}))
    }
}

retrieveRouter.get('/admin/time-tables', authMiddleware(), wrapRequestHandler(readTimeTables))