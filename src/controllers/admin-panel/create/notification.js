const { createRouter } = require('../../../routes/apiRouter')
const { validate } = require('../../../helpers/validations');
const { success, error } = require('../../../helpers/response')
const { wrapRequestHandler } = require('../../../helpers/response')
const { body } = require("express-validator");
const { Notification, Log } = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')



const createNotification = async (req, res) => {
    const userData = req.body
    const tokenData = req.response.user

    const notification = await Notification.create(userData)
    Log.create({ logTypeId: tokenData.logTypeId, description: `Notification Successfully Added By ${tokenData.name}`, createdBy: tokenData.id })
    res.send(success('Course created', notification))
}


createRouter.post('/admin/notification', authMiddleware(), validate([
    body('title').notEmpty().withMessage('Title is Required'),
    body('description').notEmpty().withMessage('Description is Required'),
]), wrapRequestHandler(createNotification))