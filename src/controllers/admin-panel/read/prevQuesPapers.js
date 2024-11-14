const {retrieveRouter} = require('../../../routes/apiRouter')
const {success, error} = require('../../../helpers/response')
const {wrapRequestHandler} = require('../../../helpers/response')
const {Book, Course, Semester, User, Subject, sequelize, PrevQuesPaper} = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')
const {Op} = require('sequelize');


const readPrevQuesPapers = async (req, res) => {
    const {limit, page, search, status, courseId, semesterId} = req.query

    let where = {}
    if (search) {
        where = {
            [Op.and]: [
                {
                    [Op.or]: [
                        {session: {[Op.like]: "%" + search + "%"}},
                        // { writerName: { [Op.like]: "%" + search + "%" } },
                    ]
                },
            ],
        }
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


    let prevQuesPapers = await PrevQuesPaper.findAll({
        where: where,
        include: [
            {model: Course, as: "course", attributes: ['courseName']},
            {model: Semester, as: "semester", attributes: ['semester']},
            {model: Subject, as: "subject", attributes: ['subjectName']},
            {model: User, as: 'user', attributes: ['name']}
        ],
        limit: +limit,
        offset:  page * limit,
        order: [['id', 'DESC']]
    })
    if (prevQuesPapers.length) {
        let rows = await PrevQuesPaper.count()
        res.json(success('Successfully retrieve', {rows: prevQuesPapers, totalRecords: rows}))
    } else {
        res.json(success('Successfully retrieve', {rows: [], totalRecords: 0}))
    }
}

retrieveRouter.get('/admin/prevQuesPapers', authMiddleware(), wrapRequestHandler(readPrevQuesPapers))