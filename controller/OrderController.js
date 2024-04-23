// const mariadb = require('mysql2/promise');
const conn = require('../pool');
const { StatusCodes } = require('http-status-codes');
const { ensureAuthorization } = require('../jwtAuthorization');

const order = async (req, res) => {
    const authorization = ensureAuthorization(req);
    const { items, delivery, totalQuantity, totalPrice, firstBookTitle } = req.body;

    const connection = await conn.getConnection();

    try {
        await connection.beginTransaction();

        // delivery 테이블 삽입
        let sql = `INSERT INTO delivery (address, receiver, contact) 
                        VALUES (?, ?, ?)`;
        let values = [delivery.address, delivery.receiver, delivery.contact];
        let [results] = await connection.execute(sql, values);
        const deliveryId = results.insertId;

        // orders 테이블 삽입
        sql = `INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id) 
                    VALUES (?, ?, ?, ?, ?)`;
        values = [firstBookTitle, totalQuantity, totalPrice, authorization.id, deliveryId];
        [results] = await connection.execute(sql, values);
        const orderId = results.insertId;

        // items로 장바구니에서 book_id, quantity 조회
        sql = `SELECT book_id, quantity FROM cartItems WHERE id IN (?)`;
        const [orderItems, fields] = await connection.query(sql, [items]);
        if (!orderItems.length) {
            throw new ReferenceError('장바구니에 없는 상품입니다.');
        }

        // orderedBook 테이블 삽입
        sql = `INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?`;
        values = [];
        orderItems.forEach((item) => {
            values.push([orderId, item.book_id, item.quantity]);
        });
        results = await connection.query(sql, [values]);

        let result = await deleteCartItems(connection, items);

        await connection.commit();

        // 응답 전송
        res.status(StatusCodes.CREATED).json(result);
    } catch (err) {
        console.log(err.name);
        console.log(err.message);
        await connection.rollback();
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    } finally {
        connection.release();
    }
};

const deleteCartItems = async (conn, items) => {
    let sql = `DELETE FROM cartItems WHERE id IN (?)`;
    const result = await conn.query(sql, [items]);

    return result[0];
}

const getOrders = async (req, res) => {
    try {
        const authorization = ensureAuthorization(req);

        const sql = `SELECT orders.id, created_at, address, receiver, contact, 
                        book_title, total_quantity total_price
                        FROM orders
                        LEFT JOIN delivery
                        ON delivery_id = delivery.id
                        WHERE user_id = ?`;
        const [results, fields] = await conn.query(sql, authorization.id);

        if (results.length) {
            return res.status(StatusCodes.OK).json(results);
        } else {
            return res.status(StatusCodes.NOT_FOUND).end();
        }
    } catch (err) {
        console.log(err.name);
        console.log(err.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
};

const getOrderDetail = async (req, res) => {
    const orderId = parseInt(req.params.id);

    try {
        const sql = `SELECT book_id, title, author, price, quantity
        FROM orderedBook
        LEFT JOIN books
        ON orderedBook.book_id = books.id
        WHERE order_id = ?`;
        const values = [orderId];
        const [results, fields] = await conn.query(sql, values);

        if (results.length) {
            return res.status(StatusCodes.OK).json(results);
        } else {
            return res.status(StatusCodes.NOT_FOUND).end();
        }
    } catch (err) {
        console.log(err.name);
        console.log(err.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
}

module.exports = { order, getOrders, getOrderDetail };