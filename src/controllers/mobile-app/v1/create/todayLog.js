const { createRouter} = require('../../../../routes/apiRouter')
const {success, error} = require('../../../../helpers/response')
const {wrapRequestHandler} = require('../../../../helpers/response')
const {LogType} = require('../../../../models')
const {studentAppAuthMiddleware} = require('../../../../middleware/authMiddleware')


const readFaqs = async (req, res) => {

    let log = await LogType.create({
        platform: 'android',
        type: ''
    });

    res.json(success('', {log}));
}

createRouter.post('/app/v1/student/todayLog',
    studentAppAuthMiddleware(),
    wrapRequestHandler(readFaqs)
)