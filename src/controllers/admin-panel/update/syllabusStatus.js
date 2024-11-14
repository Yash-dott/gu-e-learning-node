const { updateRouter } = require('../../../routes/apiRouter')
const { validate } = require('../../../helpers/validations');
const { success, error } = require('../../../helpers/response')
const { wrapRequestHandler } = require('../../../helpers/response')
const { body } = require("express-validator");
const { Syllabus, Log } = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')


const syllabusStatus = async (req, res) => {
    const { status, id } = req.body
    const tokenData = req.response.user

    let syllabus = await Syllabus.update({ status: status }, { where: { id } })

    if (syllabus[0]) {
        Log.create({ logTypeId: tokenData.logTypeId, description: `Book Status Successfully Changed By ${tokenData.name}`, createdBy: tokenData.id })
        res.json(success('Successfully updated'))
    } else {
        res.json(error('Unable to update'))
    }
}

updateRouter.post('/admin/syllabus-status', authMiddleware(), validate([
    body('status').notEmpty().withMessage('Status is required'),
    body('id').notEmpty().withMessage('Id is Required'),
]), wrapRequestHandler(syllabusStatus))