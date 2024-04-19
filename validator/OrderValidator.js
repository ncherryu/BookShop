const { body, param, validationResult } = require('express-validator');

const validate = (req, res, next) => {
    const err = validationResult(req);

    if (err.isEmpty()) {
        return next();
    } else {
        return res.status(400).json(err.array());
    }
}

const itemsValidate = body('items').notEmpty().isArray().withMessage('아이템 id 목록 필요');
const deliveryValidate = body('delivery').notEmpty().withMessage('배송 정보 필요');
const quantityValidate = body('totalQuantity').notEmpty().isInt().withMessage('수량 필요');
const priceValidate = body('totalPrice').notEmpty().isInt().withMessage('가격 필요');
const userIdValidate = body('userId').notEmpty().isInt().withMessage('사용자 id 필요');
const bookTitleValidate = body('firstBookTitle').notEmpty().withMessage('대표 책 이름 필요');
const orderIdValidate = param('id').notEmpty().isInt().withMessage('주문 id 필요');


module.exports = {
    itemsValidate,
    deliveryValidate,
    quantityValidate,
    priceValidate,
    userIdValidate,
    bookTitleValidate,
    orderIdValidate,
    validate
};