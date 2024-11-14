const { deleteRouter } = require('../../../routes/apiRouter')
const { validate } = require('../../../helpers/validations');
const { success, error } = require('../../../helpers/response')
const { wrapRequestHandler } = require('../../../helpers/response')
const { body } = require("express-validator");
const { Subject, Log } = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')



const deleteSubject = async (req, res) => {
    const { id } = req.body
    const tokenData = req.response.user

    let course = await Subject.destroy({ where: { id } })

    if (course) {
        Log.create({ logTypeId: tokenData.logTypeId, description: `Course Successfully Deleted By ${tokenData.name}`, createdBy: tokenData.id })
        res.json(success('Subject deleted'))
    } else {
        res.json(error('Subject does not exist'))
    }
}


deleteRouter.post('/admin/subject', authMiddleware(), validate([
    body('id').notEmpty().withMessage('Id is Required'),
]), wrapRequestHandler(deleteSubject))