const express = require('express');
const router = express.Router();
const { addToCart, getCartItems, removeCartItem } = require('../controller/CartController');
const {
    bookIdValidate,
    cartIdValidate,
    quantityValidate
} = require('../validator/CartValidator');
const { validate } = require('../validator/validate');
const { validateToken } = require('../jwtAuthorization');

router.use(express.json());

// 장바구니 담기
router.post(
    '/',
    [validateToken, bookIdValidate, quantityValidate, validate],
    addToCart
);

// 장바구니 아이템 목록 조회
// 선택한 장바구니 상품 목록 조회
router.get(
    '/',
    [validateToken, validate],
    getCartItems
);

// 장바구니 도서 삭제
router.delete(
    '/:id',
    [validateToken, cartIdValidate, validate],
    removeCartItem
);

module.exports = router;