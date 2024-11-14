const { retrieveRouter } = require('../../../routes/apiRouter')
const { success, error } = require('../../../helpers/response')
const { wrapRequestHandler } = require('../../../helpers/response')
const { Log, User, sequelize } = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')
const { Op } = require('sequelize');


const readLogs = async (req, res) => {
    const { limit, page, search } = req.query

    let where
    if (search) {
        where = {
            [Op.and]: [
                {
                    [Op.or]: [
                        { question: { [Op.like]: "%" + search + "%" } },
                        { answer: { [Op.like]: "%" + search + "%" } },
                    ]
                },
            ],
        }
    }

    let logs = await Log.findAll({
        where: where,
        include: [
            { model: User, as: 'user', attributes: [] }
        ],
        attributes: [
            'id',
            'description',
            [sequelize.col('user.name'), 'createdBy'],
            'createdAt',
            'updatedAt'
        ],
        limit: +limit,
        offset: page * limit,
        order: [['id', 'DESC']]
    })
    if (logs.length) {
        let rows = await Log.count()
        res.json(success('Successfully retrieve', { rows: logs, totalRecords: rows }))
    } else {
        res.json(success('Successfully retrieve', { rows: [], totalRecords: 0 }))
    }
}

retrieveRouter.get('/admin/logs', authMiddleware(), wrapRequestHandler(readLogs))