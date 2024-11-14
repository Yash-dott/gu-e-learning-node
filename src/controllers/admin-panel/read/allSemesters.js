const { retrieveRouter } = require('../../../routes/apiRouter')
const { success, error } = require('../../../helpers/response')
const { wrapRequestHandler } = require('../../../helpers/response')
const { Semester, sequelize } = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')
const { Op } = require('sequelize');


const readSemesters = async (req, res) => {

    const { id } = req.query
    let semesters = await Semester.findAll({
        where: { courseId: id },
        attributes: [
            'id',
            [sequelize.col('semester'), 'semesterName'],
        ],
    })
    res.json(success('Successfully retrieve', semesters))
}

retrieveRouter.get('/admin/all-semesters', authMiddleware(), wrapRequestHandler(readSemesters))