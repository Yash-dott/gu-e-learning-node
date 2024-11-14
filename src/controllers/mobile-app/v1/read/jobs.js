const {retrieveRouter} = require('../../../../routes/apiRouter')
const {success, error} = require('../../../../helpers/response')
const {wrapRequestHandler} = require('../../../../helpers/response')
const {Job} = require('../../../../models')
const {studentAppAuthMiddleware} = require('../../../../middleware/authMiddleware')
const {Op} = require('sequelize');


const readJobs = async (req, res) => {

    const {search, courseId} = req.query;
    let where = {}

    if (search) {
        where = {
            "jobTitle": {[Op.like]: `%${search}%`},
            "jobDescription": {[Op.like]: `%${search}%`}
        }
    }
    if (courseId) {
        where = {
            ...where,
            course: courseId
        }
    }
    const jobs = await Job.findAll({
        where: {
            status: 1,
            ...where
        },
        order: [['id', 'DESC']]
    });
    res.json(success('', {jobs}));
}

retrieveRouter.get('/app/v1/student/jobs',
    studentAppAuthMiddleware(),
    wrapRequestHandler(readJobs)
)