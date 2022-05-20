const User = require('../../models/User');
const StatusCodes =  require('http-status-codes');
const customError = require('../../errors');

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
    res.status(StatusCodes.OK).json({ status: true, data: user });
};
const getProfile = async (req, res) => {
 res.send('profile user');
};
const update = async (req, res) => {
 res.send('update user');
};
const updatePassword = async (req, res) => {
 res.send('updatePassword');
};

module.exports = {
    getUsers,
    getUser,
    getProfile,
    update,
    updatePassword
}