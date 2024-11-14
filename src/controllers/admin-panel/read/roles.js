const { retrieveRouter } = require('../../../routes/apiRouter')
const { success } = require('../../../helpers/response')
const { wrapRequestHandler } = require('../../../helpers/response')
const { Role } = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')


const readRoles = async (req, res) => {

    let roles = await Role.findAll({
        attributes: ['id', 'name']
    })
    res.json(success('Successfully retrieve', roles))
}

retrieveRouter.get('/admin/roles', authMiddleware(), wrapRequestHandler(readRoles))