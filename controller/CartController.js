const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');
const { ensureAuthorization } = require('../jwtAuthorization');

// 장바구니 담기
const addToCart = (req, res) => {
    const bookId = parseInt(req.body.book_id);
    const quantity = parseInt(req.body.quantity);

    const authorization = ensureAuthorization(req);

    const sql = `INSERT INTO cartItems (book_id, quantity, user_id) VALUES (?, ?, ?)`;
    const values = [bookId, quantity, authorization.id];
    conn.query(sql, values,
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            res.status(StatusCodes.CREATED).json(results);
        });
}

// 장바구니 아이템 목록 조회, 선택한 상품 조회
const getCartItems = (req, res) => {
    const { selected } = req.body;

    const authorization = ensureAuthorization(req);

    let sql = `SELECT cartItems.id, book_id, title, summary, quantity, price 
                    FROM cartItems LEFT JOIN books 
                    ON cartItems.book_id = books.id
                    WHERE user_id = ?`;
    const values = [authorization.id];

    if (selected && selected.length) {
        sql += ` AND cartItems.id IN (?)`;
        values.push(selected);
    }

    conn.query(sql, values,
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            return res.status(StatusCodes.OK).json(results);
        });
}

// 장바구니 아이템 삭제
const removeCartItem = (req, res) => {
    const id = parseInt(req.params.id);

    const sql = `DELETE FROM cartItems WHERE id = ?`
    conn.query(sql, id,
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            if (results.affectedRows) {
                return res.status(StatusCodes.OK).json(results);
            } else {
                return res.status(StatusCodes.NOT_FOUND).end();
            }

        });
};

module.exports = { addToCart, getCartItems, removeCartItem };