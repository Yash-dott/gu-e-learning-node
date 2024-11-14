const { deleteRouter } = require('../../../routes/apiRouter')
const { validate } = require('../../../helpers/validations');
const { success, error } = require('../../../helpers/response')
const { wrapRequestHandler } = require('../../../helpers/response')
const { body } = require("express-validator");
const { Notification, Log } = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')



const deleteNotification = async (req, res) => {
    const { id } = req.body
    const tokenData = req.response.user

    let notification = await Notification.destroy({ where: { id } })

    if (notification) {
        Log.create({ logTypeId: tokenData.logTypeId, description: `Notification Successfully Deleted By ${tokenData.name}`, createdBy: tokenData.id })
        res.json(success('Notification deleted'))
    } else {
        res.json(error('Notification does not exist'))
    }
}


deleteRouter.post('/admin/notification', authMiddleware(), validate([
    body('id').notEmpty().withMessage('Id is Required'),
]), wrapRequestHandler(deleteNotification))