const { StatusCodes } = require("http-status-codes")
const CartItem = require("../models/cartItems");
const { CustomError } = require('../utils/CustomError');
const Book = require("../models/books");
const { Op } = require("sequelize");


const addItem = async (userId, bookId, quantity) => {
    try {
        const addItemResult = await CartItem.create({
            book_id: bookId,
            quantity: quantity,
            user_id: userId
        });

        return addItemResult;
    } catch (err) {
        throw new CustomError(
            '장바구니 추가 실패',
            StatusCodes.INTERNAL_SERVER_ERROR,
            err
        );
    }
}

const getItemList = async (userId, selected) => {
    try {
        let whereCondition = { user_id: userId };
        if (selected && selected.length) {
            whereCondition = {
                ...whereCondition,
                id: { [Op.in]: selected }
            }
        }

        const itemList = await CartItem.findAll({
            attributes: ['id', 'book_id', 'quantity'],
            where: whereCondition,
            include: [
                {
                    model: Book,
                    as: ['title', 'summary', 'price'],
                    attributes: ['title', 'summary', 'price']
                }
            ]
        });

        if (!itemList.length) {
            throw new CustomError(
                '조회 결과가 없습니다.',
                StatusCodes.BAD_REQUEST
            );
        }

        return itemList;
    } catch (err) {
        throw new CustomError(
            err.message || '장바구니 조회 실패',
            err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            err
        );
    }
}

const removeItem = async (itemId) => {
    try {
        const removeResult = await CartItem.destroy({
            where: { id: itemId }
        });

        if (!removeResult) {
            throw new CustomError(
                '장바구니에 없는 상품입니다.',
                StatusCodes.NOT_FOUND
            )
        }

        return removeResult;
    } catch (err) {
        throw new CustomError(
            err.message || '장바구니 아이템 삭제 실패',
            err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            err
        );
    }
}

module.exports = { addItem, getItemList, removeItem };