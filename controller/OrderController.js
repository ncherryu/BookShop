const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const order = (req, res) => {
    const { items, delivery, totalQuantity, totalPrice, userId, firstBookTitle } = req.body;
    let deliveryId;
    let orderId;

    let sql = `INSERT INTO delivery (address, receiver, contact) 
                    VALUES (?, ?, ?)`;
    let values = [delivery.address, delivery.receiver, delivery.contact];
    conn.query(sql, values,
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            deliveryId = results.insertId;
        });

    sql = `INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id) 
                VALUES (?, ?, ?, ?, ?)`
    values = [firstBookTitle, totalQuantity, totalPrice, userId, deliveryId];
    conn.query(sql, values,
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            orderId = results.insertId;
        });

    sql = `INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?`;
    values = [];
    items.forEach((item) => {
        values.push([orderId, item.bookId, item.quantity]);
    });
    conn.query(sql, [values],
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            res.status(StatusCodes.CREATED).json(results);
        })
};

const getOrders = (req, res) => {
    res.json('주문 목록 조회');
};

const getOrderDetail = (req, res) => {
    res.json('주문 상세 조회');
}

module.exports = { order, getOrders, getOrderDetail };