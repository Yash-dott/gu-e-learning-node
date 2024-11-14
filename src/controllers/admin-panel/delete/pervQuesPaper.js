const { deleteRouter } = require('../../../routes/apiRouter')
const { validate } = require('../../../helpers/validations');
const { success, error } = require('../../../helpers/response')
const { wrapRequestHandler } = require('../../../helpers/response')
const { body } = require("express-validator");
const { Faq, Log, PrevQuesPaper,  } = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')



const deletePrevQuesPaper = async (req, res) => {
    const { id } = req.body
    const tokenData = req.response.user

    let prevQuesPaper = await PrevQuesPaper.destroy({ where: { id } })
    if (prevQuesPaper) {
       await Log.create({ logTypeId: tokenData.logTypeId, description: `Prev Ques Paper Successfully Deleted By ${tokenData.name}`, createdBy: tokenData.id })
        res.json(success('Paper deleted'))
    } else {
        res.json(error('Paper does not exist'))
    }
}

deleteRouter.post('/admin/prevQuesPaper', authMiddleware(), validate([
    body('id').notEmpty().withMessage('Id is Required'),
]), wrapRequestHandler(deletePrevQuesPaper))