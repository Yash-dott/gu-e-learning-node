const {createRouter} = require('../../../routes/apiRouter')
const {validate} = require('../../../helpers/validations');
const {success, error} = require('../../../helpers/response')
const {wrapRequestHandler} = require('../../../helpers/response')
const {body} = require("express-validator");
const {Gallery, Log} = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')
const {fileUpload} = require('../../../helpers/fileUpload')
const path = require('path')


const createSlider = async (req, res) => {
    const {createdBy} = req.body
    const tokenData = req.response.user
    const files = req.files

    if (!files) {
        res.json(error('Please select a file to upload.'))
    } else {
        if (path.extname(files.file.name) === '.jpg' || path.extname(files.file.name) === '.jpeg' || path.extname(files.file.name) === '.png') {
            const {fileName, extension} = await fileUpload(files.file, 'uploads/sliders')
            const slider = await Gallery.create({picture: fileName + extension, createdBy})
            await Log.create({
                logTypeId: tokenData.logTypeId,
                description: `Slider Successfully Added By ${tokenData.name}`,
                createdBy: tokenData.id
            })
            res.json(success('Slider created', slider))
        } else {
            res.json(error('Please select .jpg, .png or .jpeg file only.'))
        }
    }
}
createRouter.post('/admin/slider', authMiddleware(), wrapRequestHandler(createSlider))