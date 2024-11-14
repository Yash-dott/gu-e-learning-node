const jwt = require('jsonwebtoken');


const generateJWT = (data) => {
    return jwt.sign(data, process.env.SECRET_KEY)
}
const verifyJWT = token => {
    try {
        let response = jwt.verify(token, process.env.SECRET_KEY)
        return response
    } catch (error) {
        return false
    }
}

module.exports = { generateJWT, verifyJWT }