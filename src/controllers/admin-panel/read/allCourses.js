const { retrieveRouter } = require('../../../routes/apiRouter')
const { success, error } = require('../../../helpers/response')
const { wrapRequestHandler } = require('../../../helpers/response')
const { Course } = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')
const { Op } = require('sequelize');


const readCourses = async (req, res) => {

    let courses = await Course.findAll({
        where: { status: 1 },
        attributes: ['id', 'courseName'],
        order: [['id', 'DESC']]
    })
    res.json(success('Successfully retrieve', courses))
}

retrieveRouter.get('/admin/all-courses', authMiddleware(), wrapRequestHandler(readCourses))