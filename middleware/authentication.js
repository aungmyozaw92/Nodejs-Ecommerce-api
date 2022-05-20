const customError = require('../errors');
const { isValidToken } = require('../utils');

const authUser = async (req, res, next) => {
    const token = req.signedCookies.token;
    if(!token){
       throw new customError.UnauthenticatedError('Unauthenticated');
    }
    console.log(token);
    try {
        const { name, userId, role } = isValidToken({ token });
        req.user = { name: name, userId: userId, role: role};
        next();
    } catch (error) {
        console.log('not token2')
        throw new customError.UnauthenticatedError('Unauthenticated')
    }
}

const authorizePermissions = (...roles) => {
   return (req, res, next) => {
       if (!roles.includes(req.user.role)) {
            throw new customError.UnauthorizeError('Unauthorize to access');
       }
        next();
   }
   
}

module.exports = {
    authUser,
    authorizePermissions
}