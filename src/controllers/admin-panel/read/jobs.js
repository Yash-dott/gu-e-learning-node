const { retrieveRouter } = require('../../../routes/apiRouter')
const { success, error } = require('../../../helpers/response')
const { wrapRequestHandler } = require('../../../helpers/response')
const { Job, sequelize } = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')
const { Op } = require('sequelize');


const readJobs = async (req, res) => {
    const { limit, page, search, status } = req.query

    let where
    if (search) {
        where = {
            [Op.and]: [
                {
                    [Op.or]: [
                        { jobTitle: { [Op.like]: "%" + search + "%" } },
                        { course: { [Op.like]: "%" + search + "%" } },
                    ]
                },
            ],
        }
    }
    if (status) {
        where = { status: status }
    }

    let jobs = await Job.findAll({
        where: where,
        limit: +limit,
        offset:  page * limit,
        order: [['id', 'DESC']]
    })
    if (jobs.length) {
        let rows = await Job.count()
        res.json(success('Successfully retrieve', { rows: jobs, totalRecords: rows }))
    } else {
        res.json(success('Successfully retrieve', { rows: [], totalRecords: 0 }))
    }
}

retrieveRouter.get('/admin/jobs', authMiddleware(), wrapRequestHandler(readJobs))