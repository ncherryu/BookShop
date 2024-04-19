const { body, param, validationResult } = require('express-validator');

const validate = (req, res, next) => {
    const err = validationResult(req);

    if (err.isEmpty()) {
        return next();
    } else {
        return res.status(400).json(err.array());
    }
}

const bookIdValidate = body('book_id').notEmpty().isInt().withMessage('책 id 필요');
const userIdValidate = body('user_id').notEmpty().isInt().withMessage('사용자 id 필요');
const cartIdValidate = param('id').notEmpty().isInt().withMessage('장바구니 아이템 id 필요');
const quantityValidate = body('quantity').notEmpty().isInt().withMessage('수량 필요');

module.exports = { bookIdValidate, userIdValidate, cartIdValidate, quantityValidate, validate };