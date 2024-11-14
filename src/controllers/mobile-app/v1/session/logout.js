const {apiRouter} = require('../../../../routes/apiRouter')
const {validate} = require('../../../../helpers/validations');
const {success, error} = require('../../../../helpers/response')
const {wrapRequestHandler} = require('../../../../helpers/response')
const {body} = require("express-validator");
const {Student, AppUserToken, Course} = require('../../../../models')
const {generateJWT} = require('../../../../helpers/token')
const {generateBcrypt, compareBcrypt} = require('../../../../helpers/bcrypt')
const {studentAppAuthMiddleware} = require("../../../../middleware/authMiddleware");


const appUserLogout = async (req, res) => {
    const tokenData = req.response.user

    console.log(tokenData)
    await AppUserToken.destroy({where: {id: tokenData.id}});

    await Student.update(
        {FCM: null},
        {where: {id: tokenData.id}})

    res.json(success(''));
}


apiRouter.post('/app/v1/student/logout',
    studentAppAuthMiddleware(),
    wrapRequestHandler(appUserLogout)
);