const {createRouter} = require('../../../routes/apiRouter')
const {validate} = require('../../../helpers/validations');
const {success, error} = require('../../../helpers/response')
const {wrapRequestHandler} = require('../../../helpers/response')
const {body} = require("express-validator");
const {User, Log, Userpermission, Role} = require('../../../models')
const {generateJWT} = require('../../../helpers/token')
const {generateBcrypt} = require('../../../helpers/bcrypt')
const {authMiddleware} = require('../../../middleware/authMiddleware')


const createUser = async (req, res) => {
    const data = req.body;
    const {mobile, password, roleId} = data;
    const files = req.files;
    const tokenData = req.response.user;

    let user = await User.findOne({where: {mobile: mobile}});

    if (!user) {
        const {rolePermissions} = await Role.findByPk(roleId);

        user = await User.create({...data, password: generateBcrypt(password), picture: 'default-user.png', status: 0, createdBy: tokenData.id});

        for (const permissionId of JSON.parse(rolePermissions)) {
            await Userpermission.create({userId: user.id, permissionId});
        }
        Log.create({
            logTypeId: tokenData.logTypeId,
            description: `User Successfully Added By ${tokenData.name}`,
            createdBy: tokenData.id
        });
        res.send(success('User created'));
    } else {
        res.send(error('Mobile number already in use'));
    }
}


createRouter.post('/admin/user', authMiddleware(), validate([
    body('name').notEmpty().withMessage('Name is Required'),
    body('mobile').notEmpty().withMessage('Mobile Number is Required'),
    body('password').notEmpty().withMessage('Password is Required'),
]), wrapRequestHandler(createUser))