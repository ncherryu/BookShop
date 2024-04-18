// const conn = require('../mariadb');
const mariadb = require('mysql2/promise');
const { StatusCodes } = require('http-status-codes');

const order = async (req, res) => {
    const conn = await mariadb.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'Bookshop',
        password: 'root',
        dateStrings: true
    });

    const { items, delivery, totalQuantity, totalPrice, userId, firstBookTitle } = req.body;
    let deliveryId, orderId;

    // delivery 테이블 삽입
    let sql = `INSERT INTO delivery (address, receiver, contact) 
                    VALUES (?, ?, ?)`;
    let values = [delivery.address, delivery.receiver, delivery.contact];
    let [results] = await conn.query(sql, values);
    deliveryId = results.insertId;

    // orders 테이블 삽입
    sql = `INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id) 
                VALUES (?, ?, ?, ?, ?)`;
    values = [firstBookTitle, totalQuantity, totalPrice, userId, deliveryId];
    [results] = await conn.query(sql, values);
    orderId = results.insertId;

    // orderedBook 테이블 삽입
    sql = `INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?`;
    values = [];
    items.forEach((item) => {
        values.push([orderId, item.bookId, item.quantity]);
    });
    [results] = await conn.query(sql, [values]);

    // 응답 전송
    res.status(StatusCodes.CREATED).json(results);
};

const getOrders = (req, res) => {
    res.json('주문 목록 조회');
};

const getOrderDetail = (req, res) => {
    res.json('주문 상세 조회');
}

module.exports = { order, getOrders, getOrderDetail };