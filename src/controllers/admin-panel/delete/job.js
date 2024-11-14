const { deleteRouter } = require('../../../routes/apiRouter')
const { validate } = require('../../../helpers/validations');
const { success, error } = require('../../../helpers/response')
const { wrapRequestHandler } = require('../../../helpers/response')
const { body } = require("express-validator");
const { Job, Log } = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')



const deleteJob = async (req, res) => {
    const { id } = req.body
    const tokenData = req.response.user

    let job = await Job.destroy({ where: { id } })
    if (job) {
        await Log.create({ logTypeId: tokenData.logTypeId, description: `Job Successfully Deleted By ${tokenData.name}`, createdBy: tokenData.id })
        res.json(success('Job deleted'))
    } else {
        res.json(error('Job does not exist'))
    }
}

deleteRouter.post('/admin/job', authMiddleware(), validate([
    body('id').notEmpty().withMessage('Id is Required'),
]), wrapRequestHandler(deleteJob))