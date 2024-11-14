const {deleteRouter} = require('../../../routes/apiRouter')
const {validate} = require('../../../helpers/validations');
const {success, error} = require('../../../helpers/response')
const {wrapRequestHandler} = require('../../../helpers/response')
const {body} = require("express-validator");
const {Book, Log} = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')
const fs = require('fs')


const deleteBook = async (req, res) => {
    const {id} = req.body
    const tokenData = req.response.user

    const {fileName} = await Book.findOne({where: {id}, attributes: ['fileName'], raw: true})
    const book = await Book.destroy({where: {id}})
    fs.unlinkSync(`assets/uploads/books/${fileName}`)

    if (book) {
        await Log.create({
            logTypeId: tokenData.logTypeId,
            description: `Book Successfully Deleted By ${tokenData.name}`,
            createdBy: tokenData.id
        })
        res.json(success('Book deleted'))
    } else {
        res.json(error('Book does not exist'))
    }
}


deleteRouter.post('/admin/book', authMiddleware(), validate([
    body('id').notEmpty().withMessage('Id is Required'),
]), wrapRequestHandler(deleteBook))