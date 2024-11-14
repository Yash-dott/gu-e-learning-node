const {updateRouter} = require('../../../routes/apiRouter')
const {validate} = require('../../../helpers/validations');
const {success, error} = require('../../../helpers/response')
const {wrapRequestHandler} = require('../../../helpers/response')
const {body} = require("express-validator");
const {User, Log, Userpermission} = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')


const updateUser = async (req, res) => {
    const {name, mobile, id, permissions} = req.body
    const tokenData = req.response.user

    const user = await User.findByPk(id);

    if (user) {
        await User.update({name: name, mobile: mobile}, {where: {id: id}});
        await Userpermission.destroy({where: {userId: id}});
        for (const p of permissions) {
            await Userpermission.create({
                userId: id,
                permissionId: p
            });
        }
        Log.create({
            logTypeId: tokenData.logTypeId,
            description: `User Successfully Updated By ${tokenData.name}`,
            createdBy: tokenData.id
        })
        res.json(success('Successfully updated!'))
    } else {
        res.json(error('User not found!'))
    }
}


updateRouter.post('/admin/user', authMiddleware(),
    validate([
        body('name').notEmpty().withMessage('Name is Required'),
        body('mobile').notEmpty().withMessage('Mobile Number is Required'),
    ]), wrapRequestHandler(updateUser))