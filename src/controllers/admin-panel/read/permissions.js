const { retrieveRouter } = require('../../../routes/apiRouter')
const { success, error } = require('../../../helpers/response')
const { wrapRequestHandler } = require('../../../helpers/response')
const { Permission } = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')
const { Op } = require('sequelize');


const readPermissions = async (req, res) => {

    let permissions = await Permission.findAll({
        attributes: ['id', 'name']
    })
    res.json(success('Successfully retrieve', permissions))
}

retrieveRouter.get('/admin/permissions', authMiddleware(), wrapRequestHandler(readPermissions))