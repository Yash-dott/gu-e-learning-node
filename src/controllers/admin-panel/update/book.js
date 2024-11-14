const { updateRouter } = require('../../../routes/apiRouter')
const { validate } = require('../../../helpers/validations');
const { success } = require('../../../helpers/response')
const { wrapRequestHandler } = require('../../../helpers/response')
const { body } = require("express-validator");
const { Book, Log } = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')
const multer = require('multer')
const { fileUpload } = require('../../../helpers/fileUpload')
const fs = require('fs');




const updateBook = async (req, res) => {
    const { bookName, writerName, courseId, semesterId, subjectId, id } = req.body
    const tokenData = req.response.user
    const files = req.files
    let book

    if (files) {
        const oldBookFileName = await Book.findOne({ where: { id }, attributes: ['fileName'], raw: true })
        fs.unlinkSync(`assets/uploads/books/${oldBookFileName.fileName}`)
        const { fileName, extension } = await fileUpload(files.file, 'uploads/books')
        book = await Book.update({ bookName, writerName, fileName: fileName + extension, fileType: extension, courseId, semesterId, subjectId }, { where: { id } })
    } else {
        book = await Book.update({ bookName, writerName, courseId, semesterId, subjectId }, { where: { id } })
    }
    Log.create({ logTypeId: tokenData.logTypeId, description: `Book Successfully Updated By ${tokenData.name}`, createdBy: tokenData.id })
    res.json(success('Book updated', book))
}
updateRouter.post('/admin/book', authMiddleware(), validate([
    body('bookName').notEmpty().withMessage('Book Name is Required'),
    body('writerName').notEmpty().withMessage('Writer Name is Required'),
    body('courseId').notEmpty().withMessage('Course Id is Required'),
    body('semesterId').notEmpty().withMessage('Semester Id is Required'),
    body('subjectId').notEmpty().withMessage('Subject Id is Required'),
    body('id').notEmpty().withMessage('Id is Required')
]), wrapRequestHandler(updateBook))