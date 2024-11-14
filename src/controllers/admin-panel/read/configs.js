const { retrieveRouter } = require('../../../routes/apiRouter')
const { success, error } = require('../../../helpers/response')
const { wrapRequestHandler } = require('../../../helpers/response')
const { Config, User } = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')
const { Op } = require('sequelize');


const readConfigs = async (req, res) => {
    const { limit, page, search } = req.query

    let where = {}
    if (search) {
        where = {
            [Op.and]: [
                {
                    [Op.or]: [
                        { configName: { [Op.like]: "%" + search + "%" } },
                        { configDescription: { [Op.like]: "%" + search + "%" } },
                    ]
                },
            ],
        }
    }

    let configs = await Config.findAll({
        where: where,
        limit: +limit,
        offset:  page * limit,
        order: [['id', 'DESC']]
    })
    if (configs.length) {
        let rows = await Config.count()
        res.json(success('Successfully retrieve', { rows: configs, totalRecords: rows }))
    } else {
        res.json(success('Successfully retrieve', { rows: [], totalRecords: 0 }))
    }
}

retrieveRouter.get('/admin/configs', authMiddleware(), wrapRequestHandler(readConfigs))