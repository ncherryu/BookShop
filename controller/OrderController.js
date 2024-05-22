// const mariadb = require('mysql2/promise');
const conn = require('../pool');
const { StatusCodes } = require('http-status-codes');
const { ensureAuthorization, getLoginedId } = require('../jwtAuthorization');
const { createOrder, selectOrders, selectOrderDetail } = require('../service/OrderService');

const order = async (req, res, next) => {
    try {
        const userId = getLoginedId(req);
        const { items, delivery, totalQuantity, totalPrice, firstBookTitle } = req.body;
        const createOrderResult = await createOrder({
            userId, items, delivery, totalQuantity, totalPrice, firstBookTitle
        });

        return res.status(StatusCodes.CREATED).json(createOrderResult);
    } catch (err) {
        next(err);
    }
};

const getOrders = async (req, res, next) => {
    try {
        const userId = getLoginedId(req);
        const orders = await selectOrders(userId);
        return res.status(StatusCodes.OK).json(orders);
    } catch (err) {
        next(err);
    }
};

const getOrderDetail = async (req, res, next) => {
    try {
        const orderId = parseInt(req.params.id);
        const orderDetail = await selectOrderDetail(orderId);

        return res.status(StatusCodes.OK).json(orderDetail);
    } catch (err) {
        next(err);
    }
}

module.exports = { order, getOrders, getOrderDetail };