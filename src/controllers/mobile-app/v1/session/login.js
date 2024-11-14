const {apiRouter} = require('../../../../routes/apiRouter')
const {validate} = require('../../../../helpers/validations');
const {success, error} = require('../../../../helpers/response')
const {wrapRequestHandler} = require('../../../../helpers/response')
const {body} = require("express-validator");
const {Student, AppUserToken, Course} = require('../../../../models')
const {generateJWT} = require('../../../../helpers/token')
const {generateBcrypt, compareBcrypt} = require('../../../../helpers/bcrypt')


const appUserLogin = async (req, res) => {
    const {mobile, password, FCM} = req.body;

    try {

        let user = await Student.findOne({
            where: {mobile},
            include: [{
                model: Course,
                as: 'course',
                attributes: ['courseName']
            }],
        });

        if (user) {
            if (!user.status) res.json(error('You are inactive by admin!'))

            if (compareBcrypt(password, user.password)) {
                await Student.update({FCM}, {where: {id: user.id}});

                const token = generateJWT({
                    user: {
                        id: user.id,
                        name: user.name,
                        mobile: user.mobile,
                        picture: user.picture,
                        status: user.status,
                    }
                });
                await AppUserToken.create({
                    userId: user.id,
                    token
                });
                console.log("okk=========================", token)

                res.json(success('', {user, token}));
            } else {
                res.json(error('Username or password is incorrect'))
            }
        } else {
            res.json(error('User does not exist'))
        }
    } catch (e) {
        console.log(e)
        res.json(error(e))
    }
}


apiRouter.post('/app/v1/student/login', validate([
    body('mobile').notEmpty().withMessage('Mobile Number is Required'),
    body('password').notEmpty().withMessage('Password is Required')
]), wrapRequestHandler(appUserLogin))