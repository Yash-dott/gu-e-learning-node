const {createRouter} = require('../../routes/apiRouter')
const {validate} = require('../../helpers/validations');
const {success, error} = require('../../helpers/response')
const {wrapRequestHandler} = require('../../helpers/response')
const {body} = require("express-validator");
const {User, Userpermission, Permission} = require('../../models')
const {generateJWT} = require('../../helpers/token')
const {generateBcrypt, compareBcrypt} = require('../../helpers/bcrypt')


const adminLogin = async (req, res) => {
    const {mobile, password} = req.body;
    let user = await User.findOne({where: {mobile}, raw: true});

    if (user) {
        if (compareBcrypt(password, user.password)) {
            // delete user.password
            const permissions = await Userpermission.findAll({
                where: {userId: user.id},
                attributes: [],
                include: [
                    {
                        model: Permission,
                        as: 'permission',
                        attributes: ['code', 'id']
                    }
                ]
            });
            const token = generateJWT({
                user: {
                    id: user.id,
                    name: user.name,
                    mobile: user.mobile,
                    picture: user.picture,
                    type: user.type,
                    status: user.status,
                    logTypeId: 1
                }
            })
            res.json(success('Successfully logged in', {user, token: token, permissions}));
        } else {
            res.json(error('Username or password is incorrect'))
        }
    } else {
        res.json(error('User does not exist'))
    }
}


createRouter.post('/admin/login', validate([
    body('mobile').notEmpty().withMessage('Mobile Number is Required'),
    body('password').notEmpty().withMessage('Password is Required')
]), wrapRequestHandler(adminLogin))