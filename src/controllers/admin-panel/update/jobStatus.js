const {updateRouter} = require('../../../routes/apiRouter')
const {validate} = require('../../../helpers/validations');
const {success, error} = require('../../../helpers/response')
const {wrapRequestHandler} = require('../../../helpers/response')
const {body} = require("express-validator");
const {Job, Log} = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')


const timeJob = async (req, res) => {
    const {status, id} = req.body
    const tokenData = req.response.user

    let job = await Job.update({status: status}, {where: {id}})

    if (job[0]) {
        await Log.create({
            logTypeId: tokenData.logTypeId,
            description: `Job Status Successfully Changed By ${tokenData.name}`,
            createdBy: tokenData.id
        })
        res.json(success('Successfully updated'))
    } else {
        res.json(error('Unable to update'))
    }
}

updateRouter.post('/admin/job-status', authMiddleware(), validate([
    body('status').notEmpty().withMessage('Status is required'),
    body('id').notEmpty().withMessage('Id is Required'),
]), wrapRequestHandler(timeJob))