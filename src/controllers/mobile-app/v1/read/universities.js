const {retrieveRouter} = require('../../../../routes/apiRouter')
const {success, error} = require('../../../../helpers/response')
const {wrapRequestHandler} = require('../../../../helpers/response')
const {University} = require('../../../../models')
const {studentAppAuthMiddleware} = require('../../../../middleware/authMiddleware')
const {Op} = require('sequelize');


const readUniversities = async (req, res) => {

    const {search} = req.query;
    let where = {}

    if (search) {
        where = {
            "University.universityName": {[Op.like]: `%${search}%`}
        }
    }


    const universities = await University.findAll({
        where: {
            status: 1,
            ...where
        },
        attributes: ['id', 'picture', 'websiteLink', 'resultLink'],
        order: [['id', 'DESC']]
    });
    res.json(success('', {universities}));
}

retrieveRouter.get('/app/v1/student/universities',
    studentAppAuthMiddleware(),
    wrapRequestHandler(readUniversities)
)