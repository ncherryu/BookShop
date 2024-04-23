const { body, param } = require('express-validator');

const bookIdValidate = body('book_id')
    .notEmpty()
    .isInt()
    .custom(value => value > 0)
    .withMessage('책 id 필요');
const cartIdValidate = param('id')
    .notEmpty()
    .isInt()
    .custom(value => value > 0)
    .withMessage('장바구니 아이템 id 필요');
const quantityValidate = body('quantity')
    .notEmpty()
    .isInt()
    .custom(value => value > 0)
    .withMessage('수량 필요');

module.exports = { bookIdValidate, cartIdValidate, quantityValidate };