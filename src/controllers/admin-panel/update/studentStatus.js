const { updateRouter } = require('../../../routes/apiRouter')
const { validate } = require('../../../helpers/validations');
const { success, error } = require('../../../helpers/response')
const { wrapRequestHandler } = require('../../../helpers/response')
const { body } = require("express-validator");
const { Student, Log } = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')


const studentStatus = async (req, res) => {
    const { status, id } = req.body
    const tokenData = req.response.user

    let course = await Student.update({ status: status }, { where: { id } })

    if (course[0]) {
        Log.create({ logTypeId: tokenData.logTypeId, description: `Course Status Successfully Changed By ${tokenData.name}`, createdBy: tokenData.id })
        res.json(success('Status updated'))
    } else {
        res.json(error('Unable to update'))
    }
}

updateRouter.post('/admin/student-status', authMiddleware(), validate([
    body('status').notEmpty().withMessage('Status is required'),
    body('id').notEmpty().withMessage('Id is Required'),
]), wrapRequestHandler(studentStatus))