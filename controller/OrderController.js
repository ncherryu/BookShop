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

    // delivery 테이블 삽입
    let sql = `INSERT INTO delivery (address, receiver, contact) 
                    VALUES (?, ?, ?)`;
    let values = [delivery.address, delivery.receiver, delivery.contact];
    let [results] = await conn.execute(sql, values);
    const deliveryId = results.insertId;

    // orders 테이블 삽입
    sql = `INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id) 
                VALUES (?, ?, ?, ?, ?)`;
    values = [firstBookTitle, totalQuantity, totalPrice, userId, deliveryId];
    [results] = await conn.execute(sql, values);
    const orderId = results.insertId;

    // items로 장바구니에서 book_id, quantity 조회
    sql = `SELECT book_id, quantity FROM cartItems WHERE id IN (?)`;
    const [orderItems, fields] = await conn.query(sql, [items]);
    if (!orderItems.length) {
        res.status(StatusCodes.BAD_REQUEST).end();
    }

    // orderedBook 테이블 삽입
    sql = `INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?`;
    values = [];
    orderItems.forEach((item) => {
        values.push([orderId, item.book_id, item.quantity]);
    });
    results = await conn.query(sql, [values]);

    let result = await deleteCartItems(conn, items);

    // 응답 전송
    res.status(StatusCodes.CREATED).json(result);
};

const deleteCartItems = async (conn, items) => {
    let sql = `DELETE FROM cartItems WHERE id IN (?)`;
    const result = await conn.query(sql, [items]);

    return result[0];
}

const getOrders = async (req, res) => {
    const conn = await mariadb.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'Bookshop',
        password: 'root',
        dateStrings: true
    });

    const sql = `SELECT orders.id, created_at, address, receiver, contact, 
                    book_title, total_quantity total_price
                    FROM orders
                    LEFT JOIN delivery
                    ON delivery_id = delivery.id`;
    const [results, fields] = await conn.query(sql);

    if (results.length) {
        return res.status(StatusCodes.OK).json(results);
    } else {
        return res.status(StatusCodes.NOT_FOUND).end();
    }
};

const getOrderDetail = async (req, res) => {
    const id = parseInt(req.params.id);

    const conn = await mariadb.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'Bookshop',
        password: 'root',
        dateStrings: true
    });

    const sql = `SELECT book_id, title, author, price, quantity
                    FROM orderedBook
                    LEFT JOIN books
                    ON orderedBook.book_id = books.id
                    WHERE order_id = ?`;
    const [results, fields] = await conn.query(sql, id);

    if (results.length) {
        return res.status(StatusCodes.OK).json(results);
    } else {
        return res.status(StatusCodes.NOT_FOUND).end();
    }
}

module.exports = { order, getOrders, getOrderDetail };