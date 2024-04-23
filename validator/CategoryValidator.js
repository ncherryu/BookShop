const { query } = require('express-validator');

const limitValidate = query('limit')
    .notEmpty()
    .custom(value => value > 0)
    .withMessage('limit 필요');
const currentPageValidate = query('current_page')
    .notEmpty()
    .custom(value => value > 0)
    .withMessage('현재 페이지 숫자 필요');

module.exports = { limitValidate, currentPageValidate };