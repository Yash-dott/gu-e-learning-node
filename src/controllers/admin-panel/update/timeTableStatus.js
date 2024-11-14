const { updateRouter } = require('../../../routes/apiRouter')
const { validate } = require('../../../helpers/validations');
const { success, error } = require('../../../helpers/response')
const { wrapRequestHandler } = require('../../../helpers/response')
const { body } = require("express-validator");
const { Timetable, Log } = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')


const timeTableStatus = async (req, res) => {
    const { status, id } = req.body
    const tokenData = req.response.user

    let timeTable = await Timetable.update({ status: status }, { where: { id } })

    if (timeTable[0]) {
        Log.create({ logTypeId: tokenData.logTypeId, description: `Timetable Status Successfully Changed By ${tokenData.name}`, createdBy: tokenData.id })
        res.json(success('Successfully updated'))
    } else {
        res.json(error('Unable to update'))
    }
}

updateRouter.post('/admin/time-table-status', authMiddleware(), validate([
    body('status').notEmpty().withMessage('Status is required'),
    body('id').notEmpty().withMessage('Id is Required'),
]), wrapRequestHandler(timeTableStatus))