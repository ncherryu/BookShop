const { body, param, query, validationResult } = require('express-validator');

const validate = (req, res, next) => {
    const err = validationResult(req);

    if (err.isEmpty()) {
        return next();
    } else {
        return res.status(400).json(err.array());
    }
}

const limitValidate = query('limit').notEmpty().withMessage('limit 필요');
const currentPageValidate = query('current_page').notEmpty().withMessage('현재 페이지 숫자 필요');
const bookIdValidate = param('id').notEmpty().isInt().withMessage('책 id 필요');

module.exports = { limitValidate, currentPageValidate, bookIdValidate, validate };