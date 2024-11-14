const { retrieveRouter } = require('../../../routes/apiRouter')
const { success, error } = require('../../../helpers/response')
const { wrapRequestHandler } = require('../../../helpers/response')
const { Student, Course, Semester, User, sequelize } = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')
const { Op } = require('sequelize');


const readStudents = async (req, res) => {
    const { limit, page, search, status, courseId, semesterId } = req.query

    let where
    if (search) {
        where = {
            [Op.and]: [
                {
                    [Op.or]: [
                        { name: { [Op.like]: "%" + search + "%" } },
                        { mobile: { [Op.like]: "%" + search + "%" } },
                        { email: { [Op.like]: "%" + search + "%" } },
                    ]
                },
            ],
        }
    } else {
        if (courseId) {
            where = { ...where, courseId: courseId }
        }
        if (semesterId) {
            where = { ...where, semesterId: semesterId }
        }
        if (status) {
            where = { ...where, status: status }
        }
    }

    let students = await Student.findAll({
        where: where,
        include: [
            { model: Course, as: "course", attributes: [] },
            { model: Semester, as: "semester", attributes: [] },
            { model: User, as: 'user', attributes: [] }
        ],
        attributes: [
            'id',
            'studentId',
            'courseId',
            'picture',
            'name',
            'name',
            [sequelize.col('course.courseName'), 'courseName'],
            [sequelize.col('course.id'), 'courseId'],
            [sequelize.col('semester.semester'), 'semesterName'],
            [sequelize.col('semester.id'), 'semesterId'],
            'mobile',
            'email',
            [sequelize.col('user.name'), 'createdBy'],
            'status',
            'createdAt',
            'updatedAt'
        ],
        limit: +limit,
        offset:  page * limit,
        order: [['id', 'DESC']]
    })
    console.log(students)
    if (students.length) {
        let rows = await Student.count()
        res.send(success('Successfully retrieve', { rows: students, totalRecords: rows }))
    } else {
        res.send(success('Successfully retrieve', { rows: [], totalRecords: 0 }))
    }
}

retrieveRouter.get('/admin/students', authMiddleware(), wrapRequestHandler(readStudents))