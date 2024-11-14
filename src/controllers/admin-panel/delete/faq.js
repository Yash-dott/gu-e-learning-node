const { deleteRouter } = require('../../../routes/apiRouter')
const { validate } = require('../../../helpers/validations');
const { success, error } = require('../../../helpers/response')
const { wrapRequestHandler } = require('../../../helpers/response')
const { body } = require("express-validator");
const { Faq, Log } = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')



const deleteFaq = async (req, res) => {
    const { id } = req.body
    const tokenData = req.response.user

    let faq = await Faq.destroy({ where: { id } })
    if (faq) {
        Log.create({ logTypeId: tokenData.logTypeId, description: `Faq Successfully Deleted By ${tokenData.name}`, createdBy: tokenData.id })
        res.json(success('Course deleted'))
    } else {
        res.json(error('Course does not exist'))
    }
}

deleteRouter.post('/admin/faq', authMiddleware(), validate([
    body('id').notEmpty().withMessage('Id is Required'),
]), wrapRequestHandler(deleteFaq))