const {retrieveRouter} = require('../../../routes/apiRouter')
const {validate} = require('../../../helpers/validations');
const {success, error} = require('../../../helpers/response')
const {wrapRequestHandler} = require('../../../helpers/response')
const {body} = require("express-validator");
const {User, Role, sequelize, Userpermission} = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')
const {Op} = require('sequelize');


const readUsers = async (req, res) => {
    const {limit, page, search, status} = req.query

    let where
    if (search) {
        where = {
            [Op.and]: [
                {
                    [Op.or]: [
                        {name: {[Op.like]: "%" + search + "%"}},
                        {mobile: {[Op.like]: "%" + search + "%"}},
                    ]
                },
            ],
        }
    } else {
        if (status) {
            where = {status: status}
        }
    }

    let users = await User.findAll({
        where: where,
        include: [
            {
                model: Userpermission,
                as: 'userPermission',
                attributes: ['permissionId']
            },
            {
                model: Role,
                as: 'role',
                attributes: ['name', 'id']
            }
        ],
        attributes: [
            'id',
            'name',
            'mobile',
            'mobile',
            'picture',
            'status',
            'createdAt',
            'updatedAt'
        ],
        limit: +limit,
        offset:  page * limit,
        order: [['id', 'DESC']]
    })
    if (users.length) {
        let rows = await User.count()
        res.send(success('Successfully retrieve', {rows: users, totalRecords: rows}))
    } else {
        res.send(success('Successfully retrieve', {rows: [], totalRecords: 0}))
    }
}

retrieveRouter.get('/admin/user', authMiddleware(), wrapRequestHandler(readUsers))