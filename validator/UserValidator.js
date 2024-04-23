const { body } = require('express-validator');

const emailValidate = body('email').notEmpty().isEmail().withMessage('이메일 확인 필요');
const passwordValidate = body('password').notEmpty().isString().withMessage('비밀번호 확인 필요');

module.exports = { emailValidate, passwordValidate };