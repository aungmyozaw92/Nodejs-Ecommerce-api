const customError = require('../errors');

const checkPermission = (authUser, userId) => {
    if(authUser.role === 'admin') return;
    if(authUser.userId === userId.toString() ) return;
    throw new customError.UnauthorizeError('Not authorized to access');

}

module.exports = checkPermission;