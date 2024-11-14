const {updateRouter} = require('../../../routes/apiRouter')
const {validate} = require('../../../helpers/validations');
const {success} = require('../../../helpers/response')
const {wrapRequestHandler} = require('../../../helpers/response')
const {body} = require("express-validator");
const {University, Log} = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')
const {fileUpload} = require('../../../helpers/fileUpload')
const fs = require('fs');

const updateUniversity = async (req, res) => {
    const { id, websiteLink, resultLink, universityName} = req.body;
    const files = req.files
    const tokenData = req.response.user
    let timeTable

    if (files) {
        const oldUniversityFileName = await University.findOne({where: {id}, attributes: ['picture'], raw: true});
        fs.unlinkSync(`assets/uploads/universities/${oldUniversityFileName.picture}`)
        const {fileName, extension} = await fileUpload(files.file, 'uploads/universities')
        timeTable = await University.update({picture: fileName + extension, websiteLink, resultLink, universityName}, {where: {id}})
    } else {
        timeTable = await University.update({universityName, websiteLink,resultLink}, {where: {id}})
    }
   await Log.create({
        logTypeId: tokenData.logTypeId,
        description: `University Successfully Updated By ${tokenData.name}`,
        createdBy: tokenData.id
    })
    res.json(success('Successfully updated', timeTable))
}
updateRouter.post('/admin/university', authMiddleware(), validate([
    body('universityName').notEmpty().withMessage('University name is Required'),
    body('websiteLink').notEmpty().withMessage('Website Link is Required'),
    body('resultLink').notEmpty().withMessage('Results Link is Required'),
    body('id').notEmpty().withMessage('Id is Required')
]), wrapRequestHandler(updateUniversity))