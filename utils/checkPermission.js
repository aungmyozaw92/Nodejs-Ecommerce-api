const customError = require('../errors');

const checkPermission = (authUser, paramsId) => {
    if(authUser.role === 'admin') return;
    if(authUser.userId === paramsId.toString() ) return;
    throw new customError.UnauthorizeError('Not authorized to access');

}

module.exports = checkPermission;