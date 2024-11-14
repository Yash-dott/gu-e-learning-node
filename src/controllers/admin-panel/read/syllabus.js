const { retrieveRouter } = require('../../../routes/apiRouter')
const { success, error } = require('../../../helpers/response')
const { wrapRequestHandler } = require('../../../helpers/response')
const { Syllabus, Course, Semester, User, Subject, sequelize } = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')
const { Op } = require('sequelize');


const readBooks = async (req, res) => {
    const { limit, page, search, status, courseId, semesterId } = req.query

    let where = {}
    if (search) {
        where = {
            [Op.and]: [
                {
                    [Op.or]: [
                        { bookName: { [Op.like]: "%" + search + "%" } },
                        { writerName: { [Op.like]: "%" + search + "%" } },
                    ]
                },
            ],
        }
    }else{
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


    let syllabus = await Syllabus.findAll({
        where: where,
        include: [
            { model: Course, as: "course", attributes: ['id', 'courseName'] },
            { model: Semester, as: "semester", attributes: ['id','semester'] },
            { model: User, as: 'user', attributes: ['id', 'name'] }
        ],
        limit: +limit,
        offset:  page * limit,
        order: [['id', 'DESC']]
    })
    if (syllabus.length) {
        let rows = await Syllabus.count()
        res.json(success('Successfully retrieve', { rows: syllabus, totalRecords: rows }))
    } else {
        res.json(success('Successfully retrieve', { rows: [], totalRecords: 0 }))
    }
}

retrieveRouter.get('/admin/syllabus', authMiddleware(), wrapRequestHandler(readBooks))