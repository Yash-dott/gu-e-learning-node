const { createRouter } = require('../../../routes/apiRouter')
const { validate } = require('../../../helpers/validations');
const { success, error } = require('../../../helpers/response')
const { wrapRequestHandler } = require('../../../helpers/response')
const { body } = require("express-validator");
const { Course, Student } = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')
const { verifyJWT } = require('../../../helpers/token')
const {Op} = require("sequelize");
const {pushNotification} = require("../../../helpers/pushNotification");


const createQuickNotification = async (req, res) => {
    const { courseId, semesterId, title, description } = req.body
    const tokenData = req.response.user;
    let where = {
        status: true
    }
    if (semesterId){
            where = {
                ...where,
                courseId,
                semesterId,
                FCM: {
                    [Op.ne]: null,
                    [Op.ne]: ''
                }
            }
    }else{
        where = {
            ...where,
            courseId,
            FCM: {
                [Op.ne]: null,
                [Op.ne]: ''
            }
        }
    }
    const student = await  Student.findAll({
        where,
        attributes:['FCM']
    });
    const fcmTokens  = student.map((e)=>e.FCM)
    pushNotification(fcmTokens, title, description);
    res.json(success('', {fcmTokens}));


}


createRouter.post('/admin/quickNotification', authMiddleware(), validate([
    body('courseId').notEmpty().withMessage('Course is Required'),
    // body('semesterId').notEmpty().withMessage('Semester is Required'),
    body('title').notEmpty().withMessage('title is Required'),
    body('description').notEmpty().withMessage('Description is Required'),
]), wrapRequestHandler(createQuickNotification))