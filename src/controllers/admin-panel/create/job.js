const {createRouter} = require('../../../routes/apiRouter')
const {validate} = require('../../../helpers/validations');
const {success, error} = require('../../../helpers/response')
const {wrapRequestHandler} = require('../../../helpers/response')
const {body} = require("express-validator");
const {Job, Log, Course} = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')
const multer = require('multer')
const {fileUpload} = require('../../../helpers/fileUpload')
const path = require("path");


const createJob = async (req, res) => {
    const {jobTitle, courseId, jobDescription, link} = req.body
    const files = req.files
    const tokenData = req.response.user
    if (!files) {
        return  res.json(error('Please select a file.'))
    } else if (path.extname(files.file.name) !== '.png' && path.extname(files.file.name) !== '.jpg') {
       return  res.json(error('Please select .jpg or .png file.'));
    }
    const {fileName, extension} = await fileUpload(files.file, 'uploads/jobs');


    const job = await Job.create({
        jobLogo: fileName + extension,
        course:courseId,
        jobDescription,
        jobTitle,
        link,
        status: 0
    })
    await Log.create({
        logTypeId: tokenData.logTypeId,
        description: `Job Successfully Added By ${tokenData.name}`,
        createdBy: tokenData.id
    })
    res.json(success('Job added', job))
}

createRouter.post('/admin/job', authMiddleware(), validate([
    body('courseId').notEmpty().withMessage('Course Id is Required'),
    body('jobTitle').notEmpty().withMessage('Job Title is Required'),
    body('jobDescription').notEmpty().withMessage('Job Description is Required'),
    body('link').notEmpty().withMessage('Link is Required'),
]), wrapRequestHandler(createJob))