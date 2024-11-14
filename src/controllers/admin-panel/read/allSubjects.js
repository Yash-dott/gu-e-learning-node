const { retrieveRouter } = require('../../../routes/apiRouter')
const { success, error } = require('../../../helpers/response')
const { wrapRequestHandler } = require('../../../helpers/response')
const { Subject } = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')
const { Op } = require('sequelize');


const readSubjects = async (req, res) => {
    const { id } = req.query

    let subjects = await Subject.findAll({
        where: { status: 1, semesterId: id },
        attributes: ['id', 'subjectName'],      
        order: [['id', 'DESC']]
    })
    res.json(success('Successfully retrieve', subjects))
}

retrieveRouter.get('/admin/all-subjects', authMiddleware(), wrapRequestHandler(readSubjects))