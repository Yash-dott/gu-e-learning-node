const { retrieveRouter } = require('../../../routes/apiRouter')
const { success, error } = require('../../../helpers/response')
const { wrapRequestHandler } = require('../../../helpers/response')
const { Notification, User, sequelize } = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')
const { Op } = require('sequelize');


const readNotifications = async (req, res) => {
    const { limit, page, search } = req.query

    let where
    if (search) {
        where = {
            [Op.and]: [
                {
                    [Op.or]: [
                        { title: { [Op.like]: "%" + search + "%" } },
                        { description: { [Op.like]: "%" + search + "%" } },
                    ]
                },
            ],
        }
    }

    let notifications = await Notification.findAll({
        where: where,
        include: [
            { model: User, as: 'user', attributes: [] }
        ],
        attributes: [
            'id',
            'title',
            'description',
            [sequelize.col('user.name'), 'createdBy'],
            'createdAt',
            'updatedAt'
        ],
        limit: +limit,
        offset:  page * limit,
        order: [['id', 'DESC']]
    })
    if (notifications.length) {
        let rows = await Notification.count()
        res.json(success('Successfully retrieve', { rows: notifications, totalRecords: rows }))
    } else {
        res.json(success('Successfully retrieve', { rows: [], totalRecords: 0 }))
    }
}

retrieveRouter.get('/admin/notifications', authMiddleware(), wrapRequestHandler(readNotifications))