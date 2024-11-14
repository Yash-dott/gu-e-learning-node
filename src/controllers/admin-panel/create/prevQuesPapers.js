const {createRouter} = require('../../../routes/apiRouter')
const {validate} = require('../../../helpers/validations');
const {success, error} = require('../../../helpers/response')
const {wrapRequestHandler} = require('../../../helpers/response')
const {body} = require("express-validator");
const {PrevQuesPaper, Log} = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')
const multer = require('multer')
const {fileUpload} = require('../../../helpers/fileUpload')
const path = require("path");


const createPrevQuesPaper = async (req, res) => {
    const { session, courseId, semesterId, subjectId, createdBy} = req.body
    const files = req.files
    const tokenData = req.response.user
    if (!files) {
        res.json(error('Please select a file.'))
    }else if (path.extname(files.file.name) !== '.pdf') {
        res.json(error('Please select .pdf file.'));
    }
    const {fileName, extension} = await fileUpload(files.file, 'uploads/prevQuesPapers');

    const prevQuesPaper = await PrevQuesPaper.create({
        file: fileName + extension,
        courseId,
        semesterId,
        subjectId,
        session,
        createdBy,
        status: 0
    })
    Log.create({
        logTypeId: tokenData.logTypeId,
        description: `Prev Ques Paper Successfully Added By ${tokenData.name}`,
        createdBy: tokenData.id
    })
    res.json(success('Paper added', prevQuesPaper))
}

createRouter.post('/admin/prevQuesPaper', authMiddleware(), validate([
    body('courseId').notEmpty().withMessage('Course Id is Required'),
    body('semesterId').notEmpty().withMessage('Semester Id is Required'),
    body('subjectId').notEmpty().withMessage('Subject Id is Required'),
    body('session').notEmpty().withMessage('Session is Required'),
]), wrapRequestHandler(createPrevQuesPaper))