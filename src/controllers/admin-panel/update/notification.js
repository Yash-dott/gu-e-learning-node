const { updateRouter } = require('../../../routes/apiRouter')
const { validate } = require('../../../helpers/validations');
const { success, error } = require('../../../helpers/response')
const { wrapRequestHandler } = require('../../../helpers/response')
const { body } = require("express-validator");
const { Notification, Log } = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')


const updateNotification = async (req, res) => {
    const { title, description, id } = req.body
    const tokenData = req.response.user

    const notification = await Notification.findOne({ where: { id } })

    if (notification.title === title && notification.description === description) {
        res.json(error('Nothing to change'))
    } else {
        Notification.update({ title, description }, { where: { id: id } })
        Log.create({ logTypeId: tokenData.logTypeId, description: `Notification Successfully Updated By ${tokenData.name}`, createdBy: tokenData.id })
        res.json(success('Successfully updated'))
    }
}


updateRouter.post('/admin/notification', authMiddleware(), validate([
    body('title').notEmpty().withMessage('Title is Required'),
    body('description').notEmpty().withMessage('Description is Required'),
    body('id').notEmpty().withMessage('Id is Required'),
]), wrapRequestHandler(updateNotification))