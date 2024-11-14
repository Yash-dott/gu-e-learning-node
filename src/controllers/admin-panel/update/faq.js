const { updateRouter } = require('../../../routes/apiRouter')
const { validate } = require('../../../helpers/validations');
const { success, error } = require('../../../helpers/response')
const { wrapRequestHandler } = require('../../../helpers/response')
const { body } = require("express-validator");
const { Faq, Log } = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')


const updateFaq = async (req, res) => {
    const { question, answer, id } = req.body
    const tokenData = req.response.user

    const faq = await Faq.findOne({ where: { id } })

    if (faq.question === question && faq.answer === answer) {
        res.json(error('Nothing to change'))
    } else {
        Faq.update({ question, answer }, { where: { id: id } })
        Log.create({ logTypeId: tokenData.logTypeId, description: `Faq Successfully Updated By ${tokenData.name}`, createdBy: tokenData.id })
        res.json(success('Successfully updated'))
    }
}


updateRouter.post('/admin/faq', authMiddleware(), validate([
    body('question').notEmpty().withMessage('Question is Required'),
    body('answer').notEmpty().withMessage('Answer is Required'),
    body('id').notEmpty().withMessage('Id is Required'),
]), wrapRequestHandler(updateFaq))