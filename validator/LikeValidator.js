const { body, param, query, validationResult } = require('express-validator');

const validate = (req, res, next) => {
    const err = validationResult(req);

    if (err.isEmpty()) {
        return next();
    } else {
        return res.status(400).json(err.array());
    }
}

const bookIdValidate = param('id').notEmpty().isInt().withMessage('책 id 필요');
const userIdValidate = body('user_id').notEmpty().isInt().withMessage('사용자 id 필요');

module.exports = { bookIdValidate, userIdValidate, validate };
