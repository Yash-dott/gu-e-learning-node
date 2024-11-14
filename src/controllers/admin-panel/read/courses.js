const { retrieveRouter } = require('../../../routes/apiRouter')
const { success, error } = require('../../../helpers/response')
const { wrapRequestHandler } = require('../../../helpers/response')
const { Course, User, sequelize } = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')
const { Op } = require('sequelize');


const readCourses = async (req, res) => {
    const { limit, page, search, status } = req.query

    let where
    if (search) {
        where = {
            [Op.and]: [
                {
                    [Op.or]: [
                        { courseName: { [Op.like]: "%" + search + "%" } },
                        { totalSemester: { [Op.like]: "%" + search + "%" } },
                    ]
                },
            ],
        }
    }
    if (status) {
        where = { status: status }
    }

    let courses = await Course.findAll({
        where: where,
        include: [
            { model: User, as: 'user', attributes: [] }
        ],
        attributes: [
            'id',
            'courseName',
            'totalSemester',
            'description',
            'status',
            [sequelize.col('user.name'), 'createdBy'],
            'createdAt',
            'updatedAt'
        ],
        limit: +limit,
        offset:  page * limit,
        order: [['id', 'DESC']]
    })
    if (courses.length) {
        let rows = await Course.count()
        res.json(success('Successfully retrieve', { rows: courses, totalRecords: rows }))
    } else {
        res.json(success('Successfully retrieve', { rows: [], totalRecords: 0 }))
    }
}

retrieveRouter.get('/admin/courses', authMiddleware(), wrapRequestHandler(readCourses))