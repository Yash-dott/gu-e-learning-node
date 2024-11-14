const {retrieveRouter} = require('../../../routes/apiRouter')
const {success, error} = require('../../../helpers/response')
const {wrapRequestHandler} = require('../../../helpers/response')
const {University, Course, Semester, User, Timetable, sequelize} = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')
const {Op} = require('sequelize');


const readUniversities = async (req, res) => {
    const {limit, page, search, status} = req.query

    let where = {}
    if (search) {
        where = { universityName: { [Op.like]: "%" + search + "%" } }
    } else {
        if (status) {
            where = {...where, status: status}
        }
    }

    let universities = await University.findAll({
        where,
        include: [
            {model: User, as: 'user', attributes: ['name']}
        ],
        limit: +limit,
        offset:  page * limit,
        order: [['id', 'DESC']],
    })

    if (universities.length) {
        let rows = await University.count()
        res.send(success('Successfully retrieve', {rows: universities, totalRecords: rows}))
    } else {
        res.send(success('Successfully retrieve', {rows: [], totalRecords: 0}))
    }
}

retrieveRouter.get('/admin/universities', authMiddleware(), wrapRequestHandler(readUniversities))