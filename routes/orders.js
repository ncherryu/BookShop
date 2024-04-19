const express = require('express');
const router = express.Router();
const { order, getOrders, getOrderDetail } = require('../controller/OrderController');
const {
    itemsValidate,
    deliveryValidate,
    quantityValidate,
    priceValidate,
    userIdValidate,
    bookTitleValidate,
    orderIdValidate,
    validate
} = require('../validator/OrderValidator');

router.use(express.json());

// 주문 하기
router.post(
    '/',
    [
        itemsValidate, deliveryValidate,
        quantityValidate, priceValidate,
        userIdValidate, bookTitleValidate,
        validate
    ],
    order
);

// 주문 목록 조회
router.get('/', getOrders);

// 주문 상세 조회
router.get(
    '/:id',
    [orderIdValidate, validate],
    getOrderDetail
);

module.exports = router;