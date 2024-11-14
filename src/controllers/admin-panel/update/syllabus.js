const {updateRouter} = require('../../../routes/apiRouter')
const {validate} = require('../../../helpers/validations');
const {success} = require('../../../helpers/response')
const {wrapRequestHandler} = require('../../../helpers/response')
const {body} = require("express-validator");
const {Syllabus, Log} = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')
const multer = require('multer')
const {fileUpload} = require('../../../helpers/fileUpload')
const fs = require('fs');


const updateSyllabus = async (req, res) => {
    const {courseId, semesterId, id} = req.body;
    const tokenData = req.response.user;
    const files = req.files;
    let syllabus;

    if (files) {
        const oldBookFileName = await Syllabus.findOne({where: {id}, attributes: ['file'], raw: true});
        fs.unlinkSync(`assets/uploads/syllabus/${oldBookFileName.file}`)
        const {fileName, extension} = await fileUpload(files.file, 'uploads/syllabus')
        syllabus = await Syllabus.update({file: fileName + extension, courseId, semesterId}, {where: {id}})
    } else {
        syllabus = await Syllabus.update({courseId, semesterId}, {where: {id}})
    }
    Log.create({
        logTypeId: tokenData.logTypeId,
        description: `Syllabus Successfully Updated By ${tokenData.name}`,
        createdBy: tokenData.id
    })
    res.json(success('Syllabus updated', syllabus))
}
updateRouter.post('/admin/syllabus', authMiddleware(), validate([
    body('courseId').notEmpty().withMessage('Course Id is Required'),
    body('semesterId').notEmpty().withMessage('Semester Id is Required'),
    body('id').notEmpty().withMessage('Id is Required')
]), wrapRequestHandler(updateSyllabus))