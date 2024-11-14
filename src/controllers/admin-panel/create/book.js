const {createRouter} = require('../../../routes/apiRouter')
const {validate} = require('../../../helpers/validations');
const {success, error} = require('../../../helpers/response')
const {wrapRequestHandler} = require('../../../helpers/response')
const {body} = require("express-validator");
const {Book, Log} = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')
const multer = require('multer')
const {fileUpload} = require('../../../helpers/fileUpload')


const createBook = async (req, res) => {
    const {bookName, writerName, courseId, semesterId, subjectId, createdBy} = req.body
    const files = req.files
    const tokenData = req.response.user
    if (!files) {
        res.json(error('Please select a file.'))
    }
    const {fileName, extension} = await fileUpload(files.file, 'uploads/books');
    const book = await Book.create({
        bookName,
        writerName,
        fileName: fileName + extension,
        fileType: extension,
        courseId,
        semesterId,
        subjectId,
        createdBy,
        status: 0
    })
    Log.create({
        logTypeId: tokenData.logTypeId,
        description: `Book Successfully Added By ${tokenData.name}`,
        createdBy: tokenData.id
    })
    res.json(success('Book created', book))
}

createRouter.post('/admin/book', authMiddleware(), validate([
    body('bookName').notEmpty().withMessage('Book Name is Required'),
    body('writerName').notEmpty().withMessage('Writer Name is Required'),
    body('courseId').notEmpty().withMessage('Course Id is Required'),
    body('semesterId').notEmpty().withMessage('Semester Id is Required'),
    body('subjectId').notEmpty().withMessage('Subject Id is Required'),
]), wrapRequestHandler(createBook))