const {updateRouter} = require('../../../routes/apiRouter')
const {validate} = require('../../../helpers/validations');
const {success} = require('../../../helpers/response')
const {wrapRequestHandler} = require('../../../helpers/response')
const {body} = require("express-validator");
const {Job, Log} = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')
const multer = require('multer')
const {fileUpload} = require('../../../helpers/fileUpload')
const fs = require('fs');


const updateJob = async (req, res) => {
    const {jobTitle, courseId, jobDescription, link, id} = req.body;

    const tokenData = req.response.user
    const files = req.files
    let job

    if (files) {
        const oldBookJobName = await Job.findOne({where: {id}, attributes: ['jobLogo'], raw: true})
        fs.unlinkSync(`assets/uploads/jobs/${oldBookJobName.jobLogo}`)
        const {fileName, extension} = await fileUpload(files.file, 'uploads/jobs')
        job = await Job.update({
            jobLogo: fileName + extension,
            course: courseId,
            jobDescription,
            jobTitle,
            link
        }, {where: {id}})
    } else {
        job = await Job.update({course: courseId, jobDescription, jobTitle, link}, {where: {id}})
    }
    await Log.create({
        logTypeId: tokenData.logTypeId,
        description: `Job Successfully Updated By ${tokenData.name}`,
        createdBy: tokenData.id
    })
    res.json(success('Job updated', job))
}
updateRouter.post('/admin/job', authMiddleware(), validate([
    body('courseId').notEmpty().withMessage('Course Id is Required'),
    body('jobTitle').notEmpty().withMessage('Job Title is Required'),
    body('jobDescription').notEmpty().withMessage('Job Description is Required'),
    body('link').notEmpty().withMessage('Link is Required'),
    body('id').notEmpty().withMessage('ID is Required'),
]), wrapRequestHandler(updateJob))