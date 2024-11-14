const { updateRouter } = require('../../../routes/apiRouter')
const { validate } = require('../../../helpers/validations');
const { success, error } = require('../../../helpers/response')
const { wrapRequestHandler } = require('../../../helpers/response')
const { body } = require("express-validator");
const { User, Log } = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')


const usersStatus = async (req, res) => {
    const { status, id } = req.body
    const tokenData = req.response.user

    let user = await User.update({ status: status }, { where: { id } })

    if (user[0]) {
        Log.create({ logTypeId: tokenData.logTypeId, description: `User Status Successfully Changed By ${tokenData.name}`, createdBy: tokenData.id })
        res.send(success('Successfully updated'))
    } else {
        res.send(error('Unable to update'))
    }
}

updateRouter.post('/admin/user-status', authMiddleware(), validate([
    body('status').notEmpty().withMessage('Status is required'),
    body('id').notEmpty().withMessage('Id is Required'),

]), wrapRequestHandler(usersStatus))