const { deleteRouter } = require('../../../routes/apiRouter')
const { validate } = require('../../../helpers/validations');
const { success, error } = require('../../../helpers/response')
const { wrapRequestHandler } = require('../../../helpers/response')
const { body } = require("express-validator");
const { Syllabus, Log } = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')



const deleteSyllabus = async (req, res) => {
    const { id } = req.body
    const tokenData = req.response.user

    let course = await Syllabus.destroy({ where: { id } })

    if (course) {
        Log.create({ logTypeId: tokenData.logTypeId, description: `Syllabus Successfully Deleted By ${tokenData.name}`, createdBy: tokenData.id })
        res.json(success('Syllabus deleted'))
    } else {
        res.json(error('Syllabus does not exist'))
    }
}


deleteRouter.post('/admin/syllabus', authMiddleware(), validate([
    body('id').notEmpty().withMessage('Id is Required'),
]), wrapRequestHandler(deleteSyllabus))