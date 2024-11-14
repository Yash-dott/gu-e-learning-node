const {error} = require("../helpers/response");
const {Student, AppUserToken} = require('../models');
const {verifyJWT} = require('../helpers/token')

const authMiddleware = () => async (req, res, next) => {
    let token_id = req.headers.authorization || req.query.token_id || "";
    token_id = token_id.replace("Bearer ", "");

    const errorMessage = "Invalid Token or Token expired";
    const response = verifyJWT(token_id)
    if (!token_id || !response) {
        return res.json(error(errorMessage));
    }
    req.response = response
    next();
}

const studentAppAuthMiddleware = () => async (req, res, next) => {
    let token_id = req.headers.authorization || req.query.token_id || "";
    token_id = token_id.replace("Bearer ", "");

    if (!token_id) return res.status(401).json(error("Token is required"));


    const errorMessage = "Invalid Token or Token expired";
    const response = verifyJWT(token_id);
    const dbToken = await AppUserToken.findOne({where:{userId: response?.user?.id ?? "",token: token_id}});
    if (!token_id || !response || !dbToken) {
        return res.status(401).json(error(errorMessage));
    }
    const student = await  Student.findByPk(response.user.id);
    if (!student.status){
        return res.status(401).json(error("You are inactive by admin!"));
    }
    req.response = response
    next();
}
module.exports = {
    authMiddleware,
    studentAppAuthMiddleware
}