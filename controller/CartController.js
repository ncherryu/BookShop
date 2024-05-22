const { StatusCodes } = require('http-status-codes');
const { getLoginedId } = require('../jwtAuthorization');
const { addItem, getItemList, removeItem } = require('../service/CartService');

// 장바구니 담기
const addToCart = async (req, res, next) => {
    try {
        const bookId = parseInt(req.body.book_id);
        const quantity = parseInt(req.body.quantity);
        const userId = getLoginedId(req);
        const addItemResult = await addItem(userId, bookId, quantity);
        return res.status(StatusCodes.CREATED).json(addItemResult);
    } catch (err) {
        next(err);
    }
}

// 장바구니 아이템 목록 조회, 선택한 상품 조회
const getCartItems = async (req, res, next) => {
    try {
        const { selected } = req.body;
        const userId = getLoginedId(req);
        const itemList = await getItemList(userId, selected);
        return res.status(StatusCodes.OK).json(itemList);
    } catch (err) {
        next(err);
    }
}

// 장바구니 아이템 삭제
const removeCartItem = async (req, res, next) => {
    try {
        const itemId = parseInt(req.params.id);
        const removeResult = await removeItem(itemId);
        return res.status(StatusCodes.OK).json(removeResult);
    } catch (err) {
        next(err);
    }
};

module.exports = { addToCart, getCartItems, removeCartItem };