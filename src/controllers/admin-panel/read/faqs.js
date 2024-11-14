const { retrieveRouter } = require('../../../routes/apiRouter')
const { success, error } = require('../../../helpers/response')
const { wrapRequestHandler } = require('../../../helpers/response')
const { Faq, User, sequelize } = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')
const { Op } = require('sequelize');


const readFaqs = async (req, res) => {
    const { limit, page, search, status } = req.query

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
    if (status) {
        where = { status: status }
    }

    let faqs = await Faq.findAll({
        where: where,
        include: [
            { model: User, as: 'user', attributes: [] }
        ],
        attributes: [
            'id',
            'question',
            'answer',
            [sequelize.col('user.name'), 'createdBy'],
            'status',
            'createdAt',
            'updatedAt'
        ],
        limit: +limit,
        offset: page * limit,
        order: [['id', 'DESC']]
    })
    if (faqs.length) {
        let rows = await Faq.count()
        res.json(success('Successfully retrieve', { rows: faqs, totalRecords: rows }))
    } else {
        res.json(success('Successfully retrieve', { rows: [], totalRecords: 0 }))
    }
}

retrieveRouter.get('/admin/faqs', authMiddleware(), wrapRequestHandler(readFaqs))