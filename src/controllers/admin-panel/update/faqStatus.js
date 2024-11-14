const { updateRouter } = require('../../../routes/apiRouter')
const { validate } = require('../../../helpers/validations');
const { success, error } = require('../../../helpers/response')
const { wrapRequestHandler } = require('../../../helpers/response')
const { body } = require("express-validator");
const { Faq, Log } = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')


const faqStatus = async (req, res) => {
    const { status, id } = req.body
    const tokenData = req.response.user

    let faq = await Faq.update({ status: status }, { where: { id } })

    if (faq[0]) {
        Log.create({ logTypeId: tokenData.logTypeId, description: `Faq Status Successfully Changed By ${tokenData.name}`, createdBy: tokenData.id })
        res.json(success('Successfully updated'))
    } else {
        res.json(error('Unable to update'))
    }
}

updateRouter.post('/admin/faq-status', authMiddleware(), validate([
    body('status').notEmpty().withMessage('Status is required'),
    body('id').notEmpty().withMessage('Id is Required'),
]), wrapRequestHandler(faqStatus))