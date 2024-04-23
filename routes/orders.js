const express = require('express');
const router = express.Router();
const { order, getOrders, getOrderDetail } = require('../controller/OrderController');
const {
    itemsValidate,
    deliveryValidate,
    quantityValidate,
    priceValidate,
    bookTitleValidate,
    orderIdValidate
} = require('../validator/OrderValidator');
const { validate } = require('../validator/validate');
const { validateToken } = require('../jwtAuthorization');

router.use(express.json());

// 주문 하기
router.post(
    '/',
    [
        validateToken,
        itemsValidate, deliveryValidate,
        quantityValidate, priceValidate,
        bookTitleValidate, validate
    ],
    order
);

// 주문 목록 조회
router.get(
    '/',
    [validateToken],
    getOrders
);

// 주문 상세 조회
router.get(
    '/:id',
    [validateToken, orderIdValidate, validate],
    getOrderDetail
);

module.exports = router;