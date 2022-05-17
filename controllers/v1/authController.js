const User = require('../../models/User');
const { StatusCodes } = require('http-status-codes');
const customError = require('../../errors');

const register = async (req, res) => {
    const { name, email, password } = req.body;
    const emailExists = await User.findOne({ email });
    if (emailExists) {
        throw new customError.BadRequestError('Email already exist');
    }
    // first registered user is an admin
    const isFirstAccount = (await User.countDocuments({})) === 0;
    const role = isFirstAccount ? 'admin' : 'user';
    
    const user = await User.create({ name, email, password, role });
    res.status(StatusCodes.CREATED).json({ status: true, data: user})
};

const login = async (req, res) => {
    res.send('login page');
};

const logout = async (req, res) => {
    res.send('logout page');
};

module.exports = {
    register,
    login,
    logout
};

