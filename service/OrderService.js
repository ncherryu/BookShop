const { Op } = require("sequelize");
const { sequelize } = require('../models/index');
const Delivery = require("../models/delivery");
const Order = require("../models/orders");
const CartItem = require("../models/cartItems");
const { CustomError } = require('../utils/CustomError');
const { StatusCodes } = require("http-status-codes");
const OrderedBook = require("../models/orderedBook");
const Book = require("../models/books");


const createOrder = async ({
    userId,
    items,
    delivery,
    totalQuantity,
    totalPrice,
    firstBookTitle
}) => {
    try {
        await sequelize.transaction(async (t) => {
            const orderItems = await CartItem.findAll({
                where: {
                    id: { [Op.in]: items }
                }
            }, { transaction: t })
            if (!orderItems.length) {
                throw new CustomError(
                    '장바구니에 없는 상품입니다.',
                    StatusCodes.BAD_REQUEST
                );
            }

            const insertDelivery = await Delivery.create({
                address: delivery.address,
                receiver: delivery.receiver,
                contact: delivery.contact
            }, { transaction: t })
            const deliveryId = insertDelivery.id;

            const insertOrder = await Order.create({
                book_title: firstBookTitle,
                total_quantity: totalQuantity,
                total_price: totalPrice,
                user_id: userId,
                delivery_id: deliveryId
            }, { transaction: t });
            const orderId = insertOrder.id;

            const orderedBookArr = [];
            orderItems.forEach(item => orderedBookArr.push({
                order_id: orderId, book_id: item.book_id, quantity: item.quantity
            }));
            await OrderedBook.bulkCreate(orderedBookArr, { transaction: t });

            const deleteCartItemsResult = await CartItem.destroy({
                where: { id: { [Op.in]: items } }
            }, { transaction: t });

            return deleteCartItemsResult;
        })
    } catch (err) {
        throw new CustomError(
            err.message || '주문 실패',
            err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            err
        );
    }
}

const selectOrders = async (userId) => {
    try {
        const orders = await Order.findAll({
            attributes: [
                'id', 'created_at', 'book_title', 'total_quantity', 'total_price'
            ],
            include: [{
                model: Delivery,
                attributes: ['address', 'receiver', 'contact']
            }],
            where: { user_id: userId }
        });

        if (!orders.length) {
            throw new CustomError(
                '주문 내역이 없습니다.',
                StatusCodes.NOT_FOUND
            );
        }

        return orders;
    } catch (err) {
        throw new CustomError(
            err.message || '주문 내역 조회 실패',
            err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            err
        );
    }
}

const selectOrderDetail = async (orderId) => {
    try {
        const orderDetail = await OrderedBook.findAll({
            attributes: ['book_id', 'quantity'],
            include: [{
                model: Book, attributes: ['title', 'author', 'price']
            }],
            where: { order_id: orderId }
        });

        if (!orderDetail.length) {
            throw new CustomError(
                '주문 상세 조회 결과가 없습니다.',
                StatusCodes.BAD_REQUEST
            );
        }

        return orderDetail;
    } catch (err) {
        throw new CustomError(
            err.message || '주문 내역 조회 실패',
            err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            err
        );
    }
}

module.exports = { createOrder, selectOrders, selectOrderDetail };