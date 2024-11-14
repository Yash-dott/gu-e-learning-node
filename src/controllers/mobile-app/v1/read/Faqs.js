const {retrieveRouter} = require('../../../../routes/apiRouter')
const {success, error} = require('../../../../helpers/response')
const {wrapRequestHandler} = require('../../../../helpers/response')
const {Semester, Course, Faq, Subject, User} = require('../../../../models')
const {studentAppAuthMiddleware} = require('../../../../middleware/authMiddleware')
const {Op} = require('sequelize');


const readFaqs = async (req, res) => {



    let faqs = await Faq.findAll({
        where: {
            status: 1,

        }
    })

    res.json(success('', {faqs}));
}

retrieveRouter.get('/app/v1/student/faqs',
    studentAppAuthMiddleware(),
    wrapRequestHandler(readFaqs)
)