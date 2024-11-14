const {apiRouter} = require('../../../../routes/apiRouter')
const {validate} = require('../../../../helpers/validations');
const {success, error} = require('../../../../helpers/response')
const {wrapRequestHandler} = require('../../../../helpers/response')
const {body} = require("express-validator");
const {Student, AppUserToken, Course} = require('../../../../models')
const {generateJWT} = require('../../../../helpers/token')
const {generateBcrypt, compareBcrypt} = require('../../../../helpers/bcrypt')
const nodemailer = require("nodemailer");


const appUserForgetPassword = async (req, res) => {
    const {mobile} = req.body;

    const student = await Student.findOne({where: {mobile}});

    if (!student) {
        return res.json(error('Student not found!'));
    }

    const password = Math.random().toString(36).slice(-8);

    const bcryptPass = await generateBcrypt(password);

    await Student.update({password: bcryptPass}, {where: {mobile}});

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: 'agrac408@gmail.com',
            pass: 'wcjmaggojcrjhceg'
        }
    });

     await transporter.sendMail({
        from: 'agrac408@gmail.com',
        to: student.email,
        subject: "Forgot Password",
         text: `Hello ${student.name},\n\nYour password has been successfully reset. \n\n\n\n Your new password is: ${password} Please use this password to log in to the Campus Connect application.\n\nThank you,\nAgra College, Agra`,
         html: `
            <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
                <p>Hello ${student.name},</p>
                <p>Your password has been successfully reset.</p>
                <p>Your new password is: <b>${password}</b></p>
                <p>Please use this password to log in to the Campus Connect application.</p>
                <p>Thank you,<br>Agra College, Agra</p>
            </div>
        `
    });


   return  res.json(success('Please check your registered email address!'));

}


apiRouter.post('/app/v1/student/forgotPassword', validate([
    body('mobile').notEmpty().withMessage('Mobile no is Required'),
]), wrapRequestHandler(appUserForgetPassword))