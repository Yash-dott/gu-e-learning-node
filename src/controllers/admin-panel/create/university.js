const { createRouter } = require('../../../routes/apiRouter')
const { validate } = require('../../../helpers/validations');
const { success, error } = require('../../../helpers/response')
const { wrapRequestHandler } = require('../../../helpers/response')
const { body } = require("express-validator");
const { University, Log } = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')
const { fileUpload } = require('../../../helpers/fileUpload')
const { Op } = require('sequelize');




const createUniversity = async (req, res) => {
    const { universityName, websiteLink, resultLink } = req.body
    const files = req.files
    const tokenData = req.response.user

    if (!files) {
        res.json(error('Please select a file.'))
    }
    let university = await University.findOne({
        where: { universityName: universityName.toLowerCase()}
    })
    if (!university) {
        const { fileName, extension } = await fileUpload(files.file, 'uploads/universities');
        university = await University.create({ picture: fileName + extension, universityName, websiteLink, resultLink, createdBy: tokenData.id, status: 0 });

       await Log.create({ logTypeId: tokenData.logTypeId, description: `University Successfully Added By ${tokenData.name}`, createdBy: tokenData.id })
        res.json(success('University created', university))
    } else {
        res.json(error('University already exist'))
    }
}

createRouter.post('/admin/university', authMiddleware(), validate([
    body('universityName').notEmpty().withMessage('University name is Required'),
    body('websiteLink').notEmpty().withMessage('Website Link is Required'),
    body('resultLink').notEmpty().withMessage('Results Link is Required'),
]), wrapRequestHandler(createUniversity))