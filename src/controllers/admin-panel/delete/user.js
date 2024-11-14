const { deleteRouter } = require('../../../routes/apiRouter')
const { validate } = require('../../../helpers/validations');
const { success, error } = require('../../../helpers/response')
const { wrapRequestHandler } = require('../../../helpers/response')
const { body } = require("express-validator");
const { User, Log } = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')



const deleteUser = async (req, res) => {
    const { id } = req.body
    const tokenData = req.response.user

    let user = await User.destroy({ where: { id } })

    if (user) {
        Log.create({ logTypeId: tokenData.logTypeId, description: `Timetable Successfully Deleted By ${tokenData.name}`, createdBy: tokenData.id })
        res.json(success('User deleted'))
    } else {
        res.json(error('User does not exist'))
    }
}

deleteRouter.post('/admin/user', authMiddleware(), validate([
    body('id').notEmpty().withMessage('Id is Required'),
]), wrapRequestHandler(deleteUser))