const {createRouter} = require('../../../routes/apiRouter')
const {validate} = require('../../../helpers/validations');
const {success, error} = require('../../../helpers/response')
const {wrapRequestHandler} = require('../../../helpers/response')
const {body} = require("express-validator");
const {Syllabus, Log, Timetable} = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')
const multer = require('multer')
const {fileUpload} = require('../../../helpers/fileUpload')
const {Op} = require("sequelize");


const createSyllabus = async (req, res) => {
    const {courseId, semesterId} = req.body
    const files = req.files
    const tokenData = req.response.user
    if (!files) {
        res.json(error('Please select a file.'))
    }
    const isSyllabusExist = await Syllabus.findOne({
        where: {
            [Op.and]: [
                {courseId},
                {semesterId}
            ]
        }
    });
    if (!isSyllabusExist) {
        const {fileName, extension} = await fileUpload(files.file, 'uploads/syllabus')
        const syllabus = await Syllabus.create({
            file: fileName + extension,
            courseId,
            semesterId,
            createdBy: tokenData.id,
            status: 0
        })
        Log.create({
            logTypeId: tokenData.logTypeId,
            description: `Syllabus Successfully Added By ${tokenData.name}`,
            createdBy: tokenData.id
        })
        res.json(success('Syllabus created', {syllabus}))
    } else {
        res.json(error('Syllabus already exist'))
    }


}

createRouter.post('/admin/syllabus', authMiddleware(), validate([
    body('courseId').notEmpty().withMessage('Course Id is Required'),
    body('semesterId').notEmpty().withMessage('Semester Id is Required'),
]), wrapRequestHandler(createSyllabus))