const { body, param } = require('express-validator');

const itemsValidate = body('items').notEmpty().isArray().withMessage('아이템 id 목록 필요');
const deliveryValidate = body('delivery').notEmpty().withMessage('배송 정보 필요');
const quantityValidate = body('totalQuantity').notEmpty().isInt().custom(value => value > 0).withMessage('수량 필요');
const priceValidate = body('totalPrice').notEmpty().isInt().custom(value => value > 0).withMessage('가격 필요');
const bookTitleValidate = body('firstBookTitle').notEmpty().withMessage('대표 책 이름 필요');
const orderIdValidate = param('id').notEmpty().isInt().custom(value => value > 0).withMessage('주문 id 필요');


module.exports = {
    itemsValidate,
    deliveryValidate,
    quantityValidate,
    priceValidate,
    bookTitleValidate,
    orderIdValidate
};