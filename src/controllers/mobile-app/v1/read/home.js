const {retrieveRouter} = require('../../../../routes/apiRouter')
const {success, error} = require('../../../../helpers/response')
const {wrapRequestHandler} = require('../../../../helpers/response')
const {LogType, Syllabus, Timetable} = require('../../../../models')
const {studentAppAuthMiddleware} = require('../../../../middleware/authMiddleware')
const {Op} = require('sequelize');


const homeData = async (req, res) => {

    const {courseId, type, semesterId} = req.query;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);


    const timetable = await Timetable.findOne({
        where: {courseId, semesterId},
        attributes: ['picture']
    });


    const syllabus = await Syllabus.findOne({
        where: {courseId, semesterId},
        attributes: ['file']
    });

    const log = await LogType.findOne({
        where: {
            userId: req.response.user.id,
            createdAt: {
                [Op.between]: [startOfDay, endOfDay]
            }
        }
    });

    if (!log){
        await LogType.create({
            platform: 'android',
            type: '',
            userId: req.response.user.id
        })
    }


    res.json(success('', {timetable: 'time-tables/' + timetable.picture, syllabus: 'syllabus/' + syllabus.file }));
}

retrieveRouter.get('/app/v1/student/home',
    studentAppAuthMiddleware(),
    wrapRequestHandler(homeData)
)