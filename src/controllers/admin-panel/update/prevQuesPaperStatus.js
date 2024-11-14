const { updateRouter } = require('../../../routes/apiRouter')
const { validate } = require('../../../helpers/validations');
const { success, error } = require('../../../helpers/response')
const { wrapRequestHandler } = require('../../../helpers/response')
const { body } = require("express-validator");
const {  Log, PrevQuesPaper} = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')


const prevQuesPaperStatus = async (req, res) => {
    const { status, id } = req.body
    const tokenData = req.response.user

    let prevQuesPaper = await PrevQuesPaper.update({ status: status }, { where: { id } })

    if (prevQuesPaper[0]) {
        await  Log.create({ logTypeId: tokenData.logTypeId, description: `Prev Ques Paper Status Successfully Changed By ${tokenData.name}`, createdBy: tokenData.id })
        res.json(success('Status updated'))
    } else {
        res.json(error('Unable to update'))
    }
}

updateRouter.post('/admin/prevQuesPaper-status', authMiddleware(), validate([
    body('status').notEmpty().withMessage('Status is required'),
    body('id').notEmpty().withMessage('Id is Required'),
]), wrapRequestHandler(prevQuesPaperStatus))