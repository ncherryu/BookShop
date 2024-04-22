const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');
const { ensureAuthorization } = require('../jwtAuthorization');

const addLike = (req, res) => {
    const bookId = parseInt(req.params.id);

    const authorization = ensureAuthorization(req);

    const sql = `INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?)`;
    const values = [authorization.id, bookId];
    conn.query(sql, values,
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            return res.status(StatusCodes.CREATED).json(results);
        });
};

const removeLike = (req, res) => {
    const bookId = parseInt(req.params.id);

    const authorization = ensureAuthorization(req);

    const sql = `DELETE FROM likes WHERE user_id = ? and liked_book_id = ?`;
    const values = [authorization.id, bookId];
    conn.query(sql, values,
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

module.exports = { addLike, removeLike };