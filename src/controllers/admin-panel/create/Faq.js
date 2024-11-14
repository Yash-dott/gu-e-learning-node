const { createRouter } = require('../../../routes/apiRouter')
const { validate } = require('../../../helpers/validations');
const { success, error } = require('../../../helpers/response')
const { wrapRequestHandler } = require('../../../helpers/response')
const { body } = require("express-validator");
const { Faq, Log } = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')


const createFaq = async (req, res) => {
    const userData = req.body
    const tokenData = req.response.user

    const faq = await Faq.create({ ...userData, status: 0 })
    Log.create({ logTypeId: tokenData.logTypeId, description: `Faq Successfully Added By ${tokenData.name}`, createdBy: tokenData.id })
    res.send(success('Faq created', faq))
}

createRouter.post('/admin/faq', authMiddleware(), validate([
    body('question').notEmpty().withMessage('Question is Required'),
    body('answer').notEmpty().withMessage('Answer is Required'),
]), wrapRequestHandler(createFaq))