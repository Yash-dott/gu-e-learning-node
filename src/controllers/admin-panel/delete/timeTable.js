const { deleteRouter } = require('../../../routes/apiRouter')
const { validate } = require('../../../helpers/validations');
const { success, error } = require('../../../helpers/response')
const { wrapRequestHandler } = require('../../../helpers/response')
const { body } = require("express-validator");
const { Timetable, Log } = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')
const fs = require('fs')


const deleteTimeTable = async (req, res) => {
    const { id } = req.body
    const tokenData = req.response.user

    const { picture } = await Timetable.findOne({ where: { id }, attributes: ['picture'], raw: true })
    const timeTable = await Timetable.destroy({ where: { id } })
    fs.unlinkSync(`assets/uploads/time-tables/${picture}`)

    if (timeTable) {
        Log.create({ logTypeId: tokenData.logTypeId, description: `Timetable Successfully Deleted By ${tokenData.name}`, createdBy: tokenData.id })
        res.json(success('Time Table deleted'))
    } else {
        res.json(error('Time Table does not exist'))
    }
}


deleteRouter.post('/admin/time-table', authMiddleware(), validate([
    body('id').notEmpty().withMessage('Id is Required'),
]), wrapRequestHandler(deleteTimeTable))