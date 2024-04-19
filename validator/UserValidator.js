const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
    const err = validationResult(req);

    if (err.isEmpty()) {
        return next();
    } else {
        return res.status(400).json(err.array());
    }
}

const emailValidate = body('email').notEmpty().isEmail().withMessage('이메일 확인 필요');
const passwordValidate = body('password').notEmpty().isString().withMessage('비밀번호 확인 필요');

module.exports = { emailValidate, passwordValidate, validate };