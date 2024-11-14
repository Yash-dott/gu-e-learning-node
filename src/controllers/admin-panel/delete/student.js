const { deleteRouter } = require('../../../routes/apiRouter')
const { validate } = require('../../../helpers/validations');
const { success, error } = require('../../../helpers/response')
const { wrapRequestHandler } = require('../../../helpers/response')
const { body } = require("express-validator");
const { Student, Log } = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')



const deleteStudent = async (req, res) => {
    const { id } = req.body
    const tokenData = req.response.user

    let student = await Student.destroy({ where: { id } })
    if (student) {
        Log.create({ logTypeId: tokenData.logTypeId, description: `Student Successfully Deleted By ${tokenData.name}`, createdBy: tokenData.id })
        res.json(success('Student deleted'))
    } else {
        res.json(error('Student does not exist'))
    }
}


deleteRouter.post('/admin/student', authMiddleware(), validate([
    body('id').notEmpty().withMessage('Id is Required'),
]), wrapRequestHandler(deleteStudent))