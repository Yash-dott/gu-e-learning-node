const {retrieveRouter} = require('../../../../routes/apiRouter')
const {success, error} = require('../../../../helpers/response')
const {wrapRequestHandler} = require('../../../../helpers/response')
const {Student} = require('../../../../models')
const {studentAppAuthMiddleware} = require('../../../../middleware/authMiddleware')
const {Op} = require('sequelize');


const readProfile = async (req, res) => {

    const {id} = req.response.user;
    const profile = await Student.findByPk(id);
    console.log(profile)
    
    res.json(success('', {profile}));
}

retrieveRouter.get('/app/v1/student/profile',
    studentAppAuthMiddleware(),
    wrapRequestHandler(readProfile)
)