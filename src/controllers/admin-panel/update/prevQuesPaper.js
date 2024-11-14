const { updateRouter } = require('../../../routes/apiRouter')
const { validate } = require('../../../helpers/validations');
const { success, error} = require('../../../helpers/response')
const { wrapRequestHandler } = require('../../../helpers/response')
const { body } = require("express-validator");
const { Book, Log, PrevQuesPaper} = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')
const multer = require('multer')
const { fileUpload } = require('../../../helpers/fileUpload')
const fs = require('fs');
const path = require("path");




const updatePrevQuesPaper = async (req, res) => {
    const { courseId, semesterId, subjectId, id, session } = req.body
    const tokenData = req.response.user
    const files = req.files
    let paper

    if (files) {
        if (path.extname(files.file.name) !== '.pdf'){
            res.json(error('Please select .pdf file.'));
        }
        const oldFileName = await PrevQuesPaper.findOne({ where: { id }, attributes: ['file'], raw: true })
        fs.unlinkSync(`assets/uploads/prevQuesPapers/${oldFileName.fileName}`)
        const { fileName, extension } = await fileUpload(files.file, 'uploads/prevQuesPapers')
        paper = await PrevQuesPaper.update({ file: fileName + extension, courseId, semesterId, subjectId, session }, { where: { id } })
    } else {
        paper = await PrevQuesPaper.update({ courseId, semesterId, subjectId, session }, { where: { id } })
    }
   await Log.create({ logTypeId: tokenData.logTypeId, description: `Prev Ques Paper Successfully Updated By ${tokenData.name}`, createdBy: tokenData.id })
    res.json(success('Paper updated', paper))
}
updateRouter.post('/admin/prevQuesPaper', authMiddleware(), validate([
    body('courseId').notEmpty().withMessage('Course Id is Required'),
    body('semesterId').notEmpty().withMessage('Semester Id is Required'),
    body('subjectId').notEmpty().withMessage('Subject Id is Required'),
    body('session').notEmpty().withMessage('Session is Required'),
    body('id').notEmpty().withMessage('Id is Required')
]), wrapRequestHandler(updatePrevQuesPaper))