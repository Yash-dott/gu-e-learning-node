const {retrieveRouter} = require('../../../../routes/apiRouter')
const {success, error} = require('../../../../helpers/response')
const {wrapRequestHandler} = require('../../../../helpers/response')
const { Gallery} = require('../../../../models')
const {studentAppAuthMiddleware} = require('../../../../middleware/authMiddleware')
const {Op} = require('sequelize');


const readSliders = async (req, res) => {

    const sliders = await Gallery.findAll({attributes:['picture', 'id']});

    res.json(success('', {sliders}));
}

retrieveRouter.get('/app/v1/student/sliders',
    studentAppAuthMiddleware(),
    wrapRequestHandler(readSliders)
)