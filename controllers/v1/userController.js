const User = require('../../models/User');
const StatusCodes =  require('http-status-codes');
const customError = require('../../errors');
const { createTokenUser, cookieToResponse, checkPermission } = require('../../utils');

const getUsers = async (req, res) => {
    const users = await User.find({ role: 'user' }).select('-password');
    res.status(StatusCodes.OK).json({ status: true, data: users});
};

const getUser = async (req, res) => {
    const id = req.params.id;
    const user = await User.findOne({ _id: id }).select('-password');
    if (!user) {
        throw new customError.NotFoundError(`No user found with id: ${id}`);
    }
    checkPermission(req.user, user._id);
    res.status(StatusCodes.OK).json({ status: true, data: user });
};

const getProfile = async (req, res) => {
 res.status(StatusCodes.OK).json({ status: true, data: req.user });
};

// const update = async (req, res) => {
//  const { email, name } = req.body;
//     if (!email || !name) {
//         throw new customError.BadRequestError('Please provide email and name');
//     }
//     const user = await User.findOneAndUpdate(
//         { _id: req.user.userId },
//         { name , email },
//         { new:true, runValidators:true }
//     );

//     const tokenUser = createTokenUser(user);
//     cookieToResponse({ res, user: tokenUser });
//      res.status(StatusCodes.OK).json({ status: true, data: tokenUser });
// };
const update = async (req, res) => {
 const { email, name } = req.body;
    if (!email || !name) {
        throw new customError.BadRequestError('Please provide email and name');
    }
    const user = await User.findOne({ _id: req.user.userId });
    user.name = name;
    user.email = email;
    await user.save();

    const tokenUser = createTokenUser(user);
    cookieToResponse({ res, user: tokenUser });
     res.status(StatusCodes.OK).json({ status: true, data: tokenUser });
};

const updatePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        throw new customError.BadRequestError('Please provide old password and new password');
    }
    const user = await User.findOne({ _id: req.user.userId});

    const correctPassword = await user.comparePassword(oldPassword);
    if (!correctPassword) {
        throw new customError.UnauthenticatedError('Invalid credentials');
    }
    user.password = newPassword;
    user.save();

    res.status(StatusCodes.OK).json({ status:true, message: 'Password updated!'});


};

module.exports = {
    getUsers,
    getUser,
    getProfile,
    update,
    updatePassword
}