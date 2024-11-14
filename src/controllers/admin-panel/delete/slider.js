const {deleteRouter} = require('../../../routes/apiRouter')
const {validate} = require('../../../helpers/validations');
const {success, error} = require('../../../helpers/response')
const {wrapRequestHandler} = require('../../../helpers/response')
const {body} = require("express-validator");
const {Gallery, Log} = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')
const fs = require("fs");


const deleteSlider = async (req, res) => {
    const {id} = req.body
    const tokenData = req.response.user

    let picture = await Gallery.findByPk(id);

    await fs.unlinkSync(`assets/uploads/sliders/${picture.picture}`)

    let slider = await Gallery.destroy({where: {id}})
    if (slider) {
        await Log.create({
            logTypeId: tokenData.logTypeId,
            description: `Slider Successfully Deleted By ${tokenData.name}`,
            createdBy: tokenData.id
        })
        res.json(success('Slider deleted'))
    } else {
        res.json(error('Slider does not exist'))
    }
}

deleteRouter.post('/admin/slider', authMiddleware(), validate([
    body('id').notEmpty().withMessage('Id is Required'),
]), wrapRequestHandler(deleteSlider))