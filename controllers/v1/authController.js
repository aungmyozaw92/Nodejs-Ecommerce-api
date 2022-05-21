const User = require('../../models/User');
const { StatusCodes } = require('http-status-codes');
const customError = require('../../errors');
const { cookieToResponse, createTokenUser } = require('../../utils');
const { token } = require('morgan');

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
    const tokenUser = createTokenUser(user);

    cookieToResponse({ res, user: tokenUser });
    res.status(StatusCodes.CREATED).json({ status: true, data: tokenUser })
};

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new customError.BadRequestError('Please provide email and password');
    }
    const user = await User.findOne({ email });
    if (!user) {
        throw new customError.UnauthenticatedError('Invalid Credential!');
    }
    const checkPassword = await user.comparePassword(password);
    if (!checkPassword) {
        throw new customError.UnauthenticatedError('Invalid Credential!');
    }
    const tokenUser = createTokenUser(user);
    cookieToResponse({ res, user: tokenUser });
    res.status(StatusCodes.OK).json({ status: true, data: tokenUser })
};

const logout = async (req, res) => {
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now())
    });
    res.status(StatusCodes.OK).json({ status:true, message: 'User successful logout'})
};

module.exports = {
    register,
    login,
    logout
};

