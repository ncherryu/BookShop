const { StatusCodes } = require('http-status-codes');
const { createUser, loginUser, checkExistedEmail, changePassword } = require('../service/UserService');

const join = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const createdResult = await createUser(email, password);
        res.status(StatusCodes.CREATED).json(createdResult);
    } catch (err) {
        next(err);
    }
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const token = await loginUser(email, password);
        res.cookie('token', token, { httpOnly: true });
        return res.status(StatusCodes.OK).json({ email });
    } catch (err) {
        next(err);
    }
};

const passwordResetRequest = async (req, res, next) => {
    try {
        const { email } = req.body;
        await checkExistedEmail(email);
        return res.status(StatusCodes.OK).json({ email });
    } catch (err) {
        next(err);
    }
};

const passwordReset = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        await changePassword(email, password);
        return res.status(StatusCodes.OK).json({ email });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    join,
    login,
    passwordResetRequest,
    passwordReset
};